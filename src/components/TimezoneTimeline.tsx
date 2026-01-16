import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { TimezoneDisplay } from '@/types';
import { convertTime, formatTimeInTimezone } from '@/utils/timezoneUtils';

interface TimezoneTimelineProps {
  timezones: TimezoneDisplay[];
  timeRange: {
    startDate: Date;
    endDate: Date;
    referenceTimezone: string;
  };
}

function TimezoneTimeline({ timezones, timeRange }: TimezoneTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || timezones.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const margin = { top: 20, right: 20, bottom: 20, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = timezones.length * 60;

    // Convert time range to each timezone
    const startTimeInRef = timeRange.startDate;
    const endTimeInRef = timeRange.endDate;

    // Find the earliest and latest times across all timezones for the scale
    let earliestTime = startTimeInRef;
    let latestTime = endTimeInRef;

    timezones.forEach(timezone => {
      const localStart = convertTime(startTimeInRef, timeRange.referenceTimezone, timezone.id);
      const localEnd = convertTime(endTimeInRef, timeRange.referenceTimezone, timezone.id);
      if (localStart < earliestTime) earliestTime = localStart;
      if (localEnd > latestTime) latestTime = localEnd;
    });

    // Add some padding to the time range
    const timePadding = (latestTime.getTime() - earliestTime.getTime()) * 0.1;
    earliestTime = new Date(earliestTime.getTime() - timePadding);
    latestTime = new Date(latestTime.getTime() + timePadding);

    // Create scales
    const xScale = d3.scaleTime()
      .domain([earliestTime, latestTime])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(timezones.map(tz => tz.id))
      .range([0, height])
      .padding(0.1);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add time axis
    const xAxis = d3.axisTop(xScale)
      .ticks(d3.timeHour.every(1))
      .tickFormat(d => d3.timeFormat('%H:%M')(d as Date));

    g.append('g')
      .attr('class', 'x-axis')
      .call(xAxis);

    // Add timezone rows
    const rows = g.selectAll('.timezone-row')
      .data(timezones)
      .enter()
      .append('g')
      .attr('class', 'timezone-row')
      .attr('transform', (d: TimezoneDisplay) => `translate(0,${yScale(d.id)!})`);

    // Add timezone labels
    rows.append('text')
      .attr('class', 'timezone-label')
      .attr('x', -10)
      .attr('y', yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d: TimezoneDisplay) => `${d.name} (${d.abbreviation})`);

    // Add time range bars for each timezone
    rows.each(function(d: TimezoneDisplay) {
      const row = d3.select(this as SVGGElement);

      // Convert the reference time range to this timezone
      const localStart = convertTime(startTimeInRef, timeRange.referenceTimezone, d.id);
      const localEnd = convertTime(endTimeInRef, timeRange.referenceTimezone, d.id);

      const xStart = xScale(localStart);
      const xEnd = xScale(localEnd);
      const barHeight = yScale.bandwidth() * 0.6;
      const barY = (yScale.bandwidth() - barHeight) / 2;

      // Add time range bar
      row.append('rect')
        .attr('class', 'time-range-bar')
        .attr('x', xStart)
        .attr('y', barY)
        .attr('width', Math.max(xEnd - xStart, 1)) // Ensure minimum width
        .attr('height', barHeight)
        .attr('fill', '#2196f3')
        .attr('fill-opacity', 0.7)
        .attr('rx', 4);

      // Add time labels
      row.append('text')
        .attr('class', 'time-label')
        .attr('x', xStart)
        .attr('y', barY - 5)
        .attr('text-anchor', 'start')
        .attr('font-size', '11px')
        .attr('fill', '#1976d2')
        .text(formatTimeInTimezone(localStart, d.id, 'HH:mm'));

      row.append('text')
        .attr('class', 'time-label')
        .attr('x', xEnd)
        .attr('y', barY - 5)
        .attr('text-anchor', 'end')
        .attr('font-size', '11px')
        .attr('fill', '#1976d2')
        .text(formatTimeInTimezone(localEnd, d.id, 'HH:mm'));
    });

  }, [timezones, timeRange]);

  if (timezones.length === 0) {
    return (
      <div className="empty-timeline">
        <p>Select timezones to view the timeline</p>
      </div>
    );
  }

  return (
    <div className="timezone-timeline">
      <svg
        ref={svgRef}
        width={800}
        height={timezones.length * 60 + 40}
      />
    </div>
  );
}

export default TimezoneTimeline;