import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { search } from "../handler/apiHandler";

export const AnagramCard = ({ result }) => {
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    if (result.blocks) {
      setShuffledBlocks(shuffleArray(result.blocks));
    }
  }, [result.blocks]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-2">
        {shuffledBlocks.map((block, index) => (
          <div
            key={index}
            className="bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors select-none"
          >
            {block.text}
          </div>
        ))}
      </div>
      <Button
        onClick={() => setRevealAnswer(!revealAnswer)}
        variant="outline"
        className="w-full mt-4"
      >
        {revealAnswer ? "Hide" : "Reveal"} Answer
      </Button>
      {revealAnswer && (
        <>
          <p className="text-sm text-gray-500 my-2">Solution</p>
          <div className="flex flex-wrap gap-1">
            {result.blocks?.map((block, index) => (
              <div
                key={index}
                className="bg-gray-100 px-2 py-1.5 rounded-md hover:bg-gray-200 transition-colors select-none"
              >
                {block.text}
              </div>
            ))}
          </div>
        </>
      )}
    </CardContent>
  );
};

export const MCQCard = ({ options }) => {
  return (
    <CardContent>
      {options?.length > 0 ? (
        <ul
          role="list"
          className="space-y-2"
          aria-label="Multiple choice options"
        >
          {options.map((option, index) => (
            <li
              key={option.id || index}
              className="flex items-start gap-2 py-1"
            >
              <Circle
                className={`${
                  option.isCorrectAnswer ? "text-green-500" : "text-red-500"
                } h-2.5 w-2.5 flex-shrink-0 mt-1.5`}
              />
              <span className="text-sm">{option.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No options available</p>
      )}
    </CardContent>
  );
};

function SearchPage() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Search Questions
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <div className="flex w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search"
            value={parameters.title}
            onChange={(e) =>
              setParameters({ ...parameters, title: e.target.value })
            }
            className="w-full md:w-80 rounded-r-none"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-l-none"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search
          </Button>
        </div>
        <div className="flex gap-2">
          <Select
            value={parameters.type}
            onValueChange={(value) =>
              setParameters({
                ...parameters,
                type: value,
                anagramType: value !== "ANAGRAM" ? "" : parameters.anagramType,
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="ANAGRAM">Anagram</SelectItem>
              <SelectItem value="READ_ALONG">Read Along</SelectItem>
              <SelectItem value="CONTENT_ONLY">Content Only</SelectItem>
            </SelectContent>
          </Select>
          {parameters.type === "ANAGRAM" && (
            <Select
              value={parameters.anagramType}
              onValueChange={(value) =>
                setParameters({ ...parameters, anagramType: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select anagram type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="WORD">WORD</SelectItem>
                <SelectItem value="SENTENCE">SENTENCE</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {currentResults.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentResults.map(
                (result) => (
                  console.log(result),
                  (
                    <Card key={result._id}>
                      <CardHeader>
                        <CardTitle className="text-md font-semibold">
                          {result.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex gap-4 items-center">
                        <p className="bg-red-500 rounded px-2 text-sm">
                          {result.type}
                        </p>
                        {result.type === "ANAGRAM" && (
                          <p className="bg-[#efa03f] rounded px-2 text-sm">
                            {result.anagramType}
                          </p>
                        )}
                      </CardContent>

                      {result.type === "MCQ" && (
                        <MCQCard options={result.options} />
                      )}

                      {result.type === "ANAGRAM" && (
                        <AnagramCard result={result} />
                      )}
                    </Card>
                  )
                )
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No results found.
            </p>
          )}

          {allResults.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
