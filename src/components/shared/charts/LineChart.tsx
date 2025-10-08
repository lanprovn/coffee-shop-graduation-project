import { useState, useEffect } from 'react';
import { monthlyStats } from '@/data/adminStats';

interface ChartData {
  month: string;
  revenue: number;
  orders: number;
}

interface LineChartProps {
  data: ChartData[];
  title: string;
  height?: number;
}

/**
 * LineChart: Component biểu đồ đường cho doanh thu theo tháng
 * Sử dụng SVG để vẽ biểu đồ đơn giản
 */
export default function LineChart({ data, title, height = 300 }: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (data.length === 0) {return null;}

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const revenueRange = maxRevenue - minRevenue;

  const chartWidth = 600;
  const chartHeight = height;
  const padding = 60;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  // Calculate points for the line
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * plotWidth;
    const y = padding + plotHeight - ((d.revenue - minRevenue) / revenueRange) * plotHeight;
    return { x, y, data: d };
  });

  // Create path for the line
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create area path (for gradient fill)
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding + plotHeight} L ${points[0].x} ${padding + plotHeight} Z`;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Horizontal grid lines */}
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
                {Math.round(minRevenue + (1 - ratio) * revenueRange).toLocaleString('vi-VN')}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {points.map((point, index) => (
            <line
              key={index}
              x1={point.x}
              y1={padding}
              x2={point.x}
              y2={padding + plotHeight}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? 8 : 5}
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Tooltip */}
              {hoveredPoint === index && (
                <g>
                  <rect
                    x={point.x - 60}
                    y={point.y - 50}
                    width="120"
                    height="40"
                    fill="#1F2937"
                    rx="4"
                  />
                  <text
                    x={point.x}
                    y={point.y - 30}
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                  >
                    {point.data.month}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 15}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#D1D5DB"
                  >
                    {point.data.revenue.toLocaleString('vi-VN')} VND
                  </text>
                </g>
              )}

              {/* X-axis labels */}
              <text
                x={point.x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#6B7280"
              >
                {point.data.month.split('/')[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Doanh thu (VND)</span>
        </div>
      </div>
    </div>
  );
}
