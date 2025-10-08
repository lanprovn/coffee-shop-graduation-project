import { useState } from 'react';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
  size?: number;
}

/**
 * PieChart: Component biểu đồ tròn cho phân bố sản phẩm bán chạy
 * Sử dụng SVG để vẽ biểu đồ tròn đơn giản
 */
export default function PieChart({ data, title, size = 300 }: PieChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  if (data.length === 0) {return null;}

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = Math.min(centerX, centerY) - 20;

  let currentAngle = 0;

  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate path for pie slice
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const slice = {
      pathData,
      percentage,
      label: item.label,
      color: item.color,
      value: item.value,
      startAngle,
      endAngle,
      index
    };

    currentAngle += angle;
    return slice;
  });

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width={size} height={size}>
            {/* Pie slices */}
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                style={{
                  opacity: hoveredSlice === null || hoveredSlice === index ? 1 : 0.7,
                  transform: hoveredSlice === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: `${centerX}px ${centerY}px`
                }}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            ))}

            {/* Center circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.3}
              fill="white"
              stroke="#E5E7EB"
              strokeWidth="2"
            />

            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#374151"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              sản phẩm
            </text>

            {/* Tooltip */}
            {hoveredSlice !== null && (
              <g>
                <rect
                  x={centerX - 60}
                  y={centerY - 80}
                  width="120"
                  height="60"
                  fill="#1F2937"
                  rx="4"
                />
                <text
                  x={centerX}
                  y={centerY - 60}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                >
                  {slices[hoveredSlice].label}
                </text>
                <text
                  x={centerX}
                  y={centerY - 45}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#D1D5DB"
                >
                  {slices[hoveredSlice].value} sản phẩm
                </text>
                <text
                  x={centerX}
                  y={centerY - 30}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#D1D5DB"
                >
                  {(slices[hoveredSlice].percentage * 100).toFixed(1)}%
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2">
        {slices.map((slice, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onMouseEnter={() => setHoveredSlice(index)}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {slice.label}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {slice.value} ({(slice.percentage * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
