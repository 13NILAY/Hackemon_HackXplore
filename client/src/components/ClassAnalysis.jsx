import React from "react";
import ClassPerformanceChart from "../components/ClassLineChart";
// import GroupedBarChart from "./GroupedBarChart";
import PieChart from "../components/PieChart";
import TopStudentsChart from "../components/TopStudents";

const ClassAnalysis = () => {
    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-6">Class Dashboard</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">

                {/* <GroupedBarChart
          studentComparisonData={[
            { name: "John", scores: [72, 78, 85, 90], color: "rgba(255, 99, 132, 0.7)" },
            { name: "Jane", scores: [80, 85, 88, 92], color: "rgba(54, 162, 235, 0.7)" },
          ]}
        /> */}


                <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <ClassPerformanceChart classData={[72, 75, 78, 80, 82]} />
                    </div>
                </div>

                <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <PieChart performanceData={[5, 10, 7, 3]} />  {/*represnts number of students in each category*/}
                    </div>
                </div>

                <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <TopStudentsChart topStudents={[{ name: "Jane", avg: 90 }, { name: "John", avg: 85 }, { name: "Sam", avg: 80 }]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassAnalysis;
