import type { EChartsOption } from 'echarts';
import type { ChartKind, MetricRecord } from '../types/metrics';

const palette = ['#4e74ff', '#59d0c5', '#ffb34d', '#ff7a59', '#8e7dff', '#89d76d'];

export const buildChartOption = (chartKind: ChartKind, metrics: MetricRecord[]): EChartsOption => {
  const labels = metrics.map((item) => item.label);
  const values = metrics.map((item) => item.value);

  if (chartKind === 'pie') {
    return {
      backgroundColor: 'transparent',
      color: palette,
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        textStyle: {
          color: '#a9b4d0',
        },
      },
      series: [
        {
          name: '渠道占比',
          type: 'pie',
          radius: ['38%', '72%'],
          center: ['50%', '44%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: '#0a1124',
            borderWidth: 4,
          },
          label: {
            color: '#e7ecff',
            formatter: '{b}\n{d}%',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(181, 196, 255, 0.45)',
            },
          },
          data: metrics.map((item) => ({
            value: item.value,
            name: item.label,
          })),
        },
      ],
    };
  }

  const baseOption: EChartsOption = {
    backgroundColor: 'transparent',
    color: palette,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 17, 36, 0.95)',
      borderColor: 'rgba(181, 196, 255, 0.2)',
      textStyle: {
        color: '#eff3ff',
      },
    },
    grid: {
      top: 24,
      right: 20,
      bottom: 36,
      left: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(181, 196, 255, 0.18)',
        },
      },
      axisLabel: {
        color: '#a9b4d0',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(181, 196, 255, 0.12)',
        },
      },
      axisLabel: {
        color: '#8f9ab8',
      },
    },
    series: [],
  };

  if (chartKind === 'line') {
    baseOption.series = [
      {
        type: 'line',
        data: values,
        smooth: true,
        symbolSize: 10,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          borderColor: '#f8fbff',
          borderWidth: 2,
        },
        areaStyle: {
          color: 'rgba(78, 116, 255, 0.12)',
        },
      },
    ];
    return baseOption;
  }

  baseOption.series = [
    {
      type: 'bar',
      data: values,
      barWidth: '42%',
      itemStyle: {
        borderRadius: [10, 10, 4, 4],
      },
    },
  ];

  return baseOption;
};
