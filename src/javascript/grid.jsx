import React, {useState, useEffect} from "react";

const MultiRezGrid = () => {
    // State for the grid configuration, with a default of 4 rows and 4 columns
    const [grid, setGrid] = useState({
        rows: Array.from({ length: 9 }, () => Array(14).fill(null)), // Initialize a 4x4 grid
        maxRows: 9,
        maxCols: 14,
    });

    return (
        <div>
            <div className="container" data-target="grid">
                <table className="bounds">
                    <tbody>
                    {grid.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((_, colIndex) => (
                                <td key={colIndex} className="bordered dropzone ng-scope"></td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MultiRezGrid;