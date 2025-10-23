"use client";

import React from "react";

export default function MainEditor() {
    return (
        <div className="flex h-screen w-full">
            <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="h-full p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Editor
                    </h2>
                </div>
            </div>

            <div className="w-1/2 bg-gray-50 dark:bg-gray-800">
                <div className="h-full p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Preview
                    </h2>
                </div>
            </div>
        </div>
    );
}
