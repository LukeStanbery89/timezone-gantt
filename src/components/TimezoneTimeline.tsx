import { useMemo } from 'react';
import {
  ChartData,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TimezoneDisplay } from '@/types';
import { transformTimezoneDataForChart, formatTimeInTimezone } from '@/utils/timezoneUtils';

interface TimezoneTimelineProps {
  timezones: TimezoneDisplay[];
  timeRange: {
    startDate: Date;
    endDate: Date;
    referenceTimezone: string;
  };
}

function TimezoneTimeline({ timezones, timeRange }: TimezoneTimelineProps) {
  const chartData = useMemo(() => {
    if (timezones.length === 0) return null;

    const transformedData = transformTimezoneDataForChart(timezones, timeRange);

    const data: ChartData<'bar'> = {
      labels: transformedData.labels,
      datasets: [{
        label: 'Time Range',
        data: transformedData.data,
        backgroundColor: 'rgba(33, 150, 243, 0.7)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20,
      }]
    };

    return { data, timeRange: transformedData.timeRange };
  }, [timezones, timeRange]);

  const timeLabelsPlugin: Plugin<'bar'> = useMemo(() => ({
    id: 'timeLabels',
    afterDraw: (chart) => {
      const { ctx, data, scales } = chart;
      const dataset = data.datasets[0];
      const xScale = scales.x;
      const yScale = scales.y;

      if (!dataset.data) return;

      ctx.save();
      ctx.font = '11px Arial';
      ctx.fillStyle = '#1976d2';
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom';

      dataset.data.forEach((dataPoint, index) => {
        if (!Array.isArray(dataPoint)) return;

        const [startTime, endTime] = dataPoint as [number, number];
        const timezone = timezones[index];

        if (!timezone) return;

        const barY = yScale.getPixelForValue(index);
        const barHeight = yScale.getPixelForValue(index + 1) - barY;
        const barCenterY = barY + barHeight / 2;

        // Draw start time label
        const startX = xScale.getPixelForValue(startTime);
        const startTimeText = formatTimeInTimezone(new Date(startTime), timezone.id, 'h:mm a');
        ctx.fillText(startTimeText, startX + 5, barCenterY - 5);

        // Draw end time label
        const endX = xScale.getPixelForValue(endTime);
        const endTimeText = formatTimeInTimezone(new Date(endTime), timezone.id, 'h:mm a');
        ctx.textAlign = 'end';
        ctx.fillText(endTimeText, endX - 5, barCenterY - 5);
      });

      ctx.restore();
    }
  }), [timezones]);

  const options: ChartOptions<'bar'> = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // For floating bars, context.parsed.x is [start, end] and context.parsed.y is the index
            const dataPoint = context.raw as [number, number];
            const timezoneIndex = context.dataIndex;
            const timezone = timezones[timezoneIndex];

            if (!timezone) return '';

            const startTime = formatTimeInTimezone(new Date(dataPoint[0]), timezone.id, 'h:mm a');
            const endTime = formatTimeInTimezone(new Date(dataPoint[1]), timezone.id, 'h:mm a');
            return `${startTime} - ${endTime}`;
          }
        }
      },
      timeLabels: timeLabelsPlugin
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'h:mm a'
          }
        },
        min: chartData?.timeRange.min.getTime(),
        max: chartData?.timeRange.max.getTime(),
        ticks: {
          source: 'auto'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          padding: 10,
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
      }
    }
  }), [timezones, chartData, timeLabelsPlugin]);

  if (timezones.length === 0) {
    return (
      <div className="empty-timeline">
        <p>Select timezones to view the timeline</p>
      </div>
    );
  }

  if (!chartData) return null;

  return (
    <div className="timezone-timeline">
      <div style={{ height: `${timezones.length * 60 + 40}px` }}>
        <Bar data={chartData.data} options={options} />
      </div>
    </div>
  );
}

export default TimezoneTimeline;