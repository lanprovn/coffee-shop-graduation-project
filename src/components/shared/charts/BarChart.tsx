import { useState, useEffect } from 'react';
import { lsGet, lsSet } from '@/utils/localStorageHelper';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  height?: number;
  color?: string;
}

/**
 * BarChart: Component biểu đồ cột cho thống kê đơn hàng theo trạng thái
 * Sử dụng SVG để vẽ biểu đồ cột đơn giản
 */
export default function BarChart({ data, title, height = 300, color = '#3B82F6' }: BarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (data.length === 0) {return null;}

  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = 500;
  const chartHeight = height;
  const padding = 60;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;
  const barWidth = plotWidth / data.length * 0.8;
  const barSpacing = plotWidth / data.length * 0.2;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={ratio}>
              <line
                x1={padding}
                y1={padding + ratio * plotHeight}
                x2={padding + plotWidth}
                y2={padding + ratio * plotHeight}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={padding + ratio * plotHeight + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {Math.round(maxValue * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * plotHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding + plotHeight - barHeight;
            const barColor = item.color || color;

            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    opacity: hoveredBar === null || hoveredBar === index ? 1 : 0.7,
                    transform: hoveredBar === index ? 'scaleY(1.05)' : 'scaleY(1)',
                    transformOrigin: `${x + barWidth/2}px ${padding + plotHeight}px`
                  }}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Value label on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight="500"
                >
                  {item.value}
                </text>

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6B7280"
                >
                  {item.label}
                </text>

                {/* Tooltip */}
                {hoveredBar === index && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 40}
                      y={y - 40}
                      width="80"
                      height="30"
                      fill="#1F2937"
                      rx="4"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 20}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                    >
                      {item.label}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#D1D5DB"
                    >
                      {item.value} đơn hàng
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng đơn hàng</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
          </div>
          <div className="text-sm text-gray-600">Trung bình</div>
        </div>
      </div>
    </div>
  );
}
