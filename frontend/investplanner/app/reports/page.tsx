import { TimeLine } from "../components/TimeLine";
import ReportGraph from "../components/reportGraph";
import CategoryBreakdown from "../components/categoryBreakdown";
import { ReportHeader } from "./reportHeader";

export default function Reports() {
    return (
        <div className="ml-64 p-8 w-4xl">
          <ReportHeader />
          
          {/* Timeline */}
          <div className="w-100 mt-6">
            <TimeLine />
          </div>
          
          {/* Graph */}
          <div className="mt-8 w-full">
            <ReportGraph />
          </div>
          
          {/* Category Breakdown - Below Graph */}
          <div className="mt-8 w-full">
            <CategoryBreakdown />
          </div>
        </div>
    );
}