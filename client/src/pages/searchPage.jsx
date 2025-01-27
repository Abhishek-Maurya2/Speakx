import React, { useState, useEffect } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { search } from "../handler/apiHandler";
import { MCQResult } from "@/components/mcqCard";
import { AnagramResult } from "@/components/anagramCard";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Card } from "@/components/ui/card";

export default function MaterialYouSearchPage() {
  const [parameters, setParameters] = useState({
    title: "",
    type: "All",
    anagramType: "",
  });
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const handleSearch = async () => {
    const { type, anagramType } = parameters;
    const searchParams = {
      ...parameters,
      type: type === "All" ? "" : type,
      anagramType:
        type === "ANAGRAM" && anagramType !== "All" ? anagramType : "",
    };

    try {
      setLoading(true);
      const results = await search(searchParams);
      setAllResults(results);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(allResults.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentResults = allResults.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-primary">
        Question Search
      </h1>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Search questions..."
              value={parameters.title}
              onChange={(e) =>
                setParameters({ ...parameters, title: e.target.value })
              }
              className="w-full min-w-[280px] bg-secondary/10 rounded-full h-16"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-2 sm:gap-4">
            <Select
              value={parameters.type}
              onValueChange={(value) =>
                setParameters({
                  ...parameters,
                  type: value,
                  anagramType:
                    value !== "ANAGRAM" ? "" : parameters.anagramType,
                })
              }
            >
              <SelectTrigger className="w-[180px] bg-secondary/10 rounded-full h-16 text-md">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-1">
                <SelectItem className="py-4 text-md rounded-2xl" value="All">
                  All Types
                </SelectItem>
                <SelectItem className="py-4 text-md rounded-2xl" value="MCQ">
                  MCQ
                </SelectItem>
                <SelectItem
                  className="py-4 text-md rounded-2xl"
                  value="ANAGRAM"
                >
                  Anagram
                </SelectItem>
                <SelectItem
                  className="py-4 text-md rounded-2xl"
                  value="READ_ALONG"
                >
                  Read Along
                </SelectItem>
                <SelectItem
                  className="py-4 text-md rounded-2xl"
                  value="CONTENT_ONLY"
                >
                  Content Only
                </SelectItem>
              </SelectContent>
            </Select>
            {parameters.type === "ANAGRAM" && (
              <Select
                value={parameters.anagramType}
                onValueChange={(value) =>
                  setParameters({ ...parameters, anagramType: value })
                }
              >
                <SelectTrigger className="w-[180px] bg-secondary/10 rounded-full h-16 text-md">
                  <SelectValue placeholder="Anagram type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl p-1">
                  <SelectItem className="py-4 rounded-2xl text-md" value="All">
                    All Anagrams
                  </SelectItem>
                  <SelectItem className="py-4 rounded-2xl text-md" value="WORD">
                    Word
                  </SelectItem>
                  <SelectItem
                    className="py-4 rounded-2xl text-md"
                    value="SENTENCE"
                  >
                    Sentence
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto bg-primary text-primary-foreground h-16 rounded-full px-8 text-xl "
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                style={{
                  height: "1.3rem",
                  width: "1.3rem",
                }}
              />
            ) : (
              <Search
                style={{
                  height: "1.3rem",
                  width: "1.3rem",
                }}
              />
            )}
            Search
          </Button>
          <ThemeToggleButton />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {currentResults.length > 0 ? (
            <div className="space-y-6">
              {currentResults.map((result) => (
                <Card
                  key={result._id}
                  className="bg-background dark:bg-secondary rounded-2xl shadow-md dark:shadow-[#ffffff22] p-6 transition-all hover:shadow-lg"
                >
                  <h2 className="text-xl font-semibold mb-2 text-primary">
                    {result.title}
                  </h2>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{result.type}</Badge>
                    {result.type === "ANAGRAM" && (
                      <Badge variant="outline">{result.anagramType}</Badge>
                    )}
                  </div>
                  {result.type === "MCQ" && (
                    <MCQResult options={result.options} />
                  )}
                  {result.type === "ANAGRAM" && (
                    <AnagramResult result={result} />
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">
              No results found. Try adjusting your search criteria.
            </p>
          )}

          {allResults.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
