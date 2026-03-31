'use client';

import React, { useState } from 'react';
import { TimeLine } from "../components/TimeLine";
import ReportGraph from "../components/reportGraph";
import CategoryBreakdown from "../components/categoryBreakdown";
import { ReportHeader } from "./reportHeader";

export default function Reports() {
    const [range, setRange] = useState('monthly');

    return (
        <div className="w-full max-w-6xl p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <ReportHeader />
          
          {/* Timeline */}
          <div className="w-full max-w-md mt-6 sm:mt-8">
            <TimeLine range={range} setRange={setRange} />
          </div>
          
          {/* Main Content Grid */}
          <div className="flex flex-col gap-8 mt-8">
            {/* Graph Card */}
            <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden p-4 sm:p-6">
              <ReportGraph range={range} />
            </div>
            
            {/* Category Breakdown Card */}
            <div className="w-full">
              <CategoryBreakdown range={range} />
            </div>
          </div>
        </div>
    );
}