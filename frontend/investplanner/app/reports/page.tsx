'use client';

import React, { useState } from 'react';
import { TimeLine } from "../components/TimeLine";
import ReportGraph from "../components/reportGraph";
import CategoryBreakdown from "../components/categoryBreakdown";
import { ReportHeader } from "./reportHeader";

export default function Reports() {
    const [range, setRange] = useState('monthly');

    return (
        <div className="ml-64 p-8 w-4xl">
          <ReportHeader />
          
          {/* Timeline */}
          <div className="w-100 mt-6">
            <TimeLine range={range} setRange={setRange} />
          </div>
          
          {/* Graph */}
          <div className="mt-8 w-full">
            <ReportGraph range={range} />
          </div>
          
          {/* Category Breakdown - Below Graph */}
          <div className="mt-8 w-full">
            <CategoryBreakdown range={range} />
          </div>
        </div>
    );
}