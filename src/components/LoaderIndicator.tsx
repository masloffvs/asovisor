import React, { useEffect, useState } from "react";
import _ from "lodash";

interface Props {
  readonly text?: string;
}

export default function LoaderIndicator(props: Props) {
  const [indicatorTexts, setIndicatorTexts] = useState(
    [
      "We search everything around",
      "A little more and we’ll definitely find it!",
      "Who did not hide - we are not to blame",
    ].concat(_.range(0, 10).map((i) => "Search")),
  );

  const [indicatorText, setIndicatorText] = useState("");

  useEffect(() => {
    setIndicatorText(String(_.sample(indicatorTexts)));
  }, []);

  return (
    <div className="flex flex-col space-y-3 justify-center items-center py-32">
      <div className="relative inline-flex">
        <div className="w-4 h-4 bg-lime-200 rounded-full"></div>
        <div className="w-4 h-4 bg-lime-200 border-lime-500 border rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-4 h-4 bg-lime-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
      <span className="text-xs text-gray-400">
        {props.text || indicatorText}
      </span>
    </div>
  );
}
