import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

export const CHART_COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']
export const CHART_COLORS_GRADIENT = ['#5470c6', '#91cc75', '#fac858']

export function useChart(containerRef) {
  let instance = null
  let resizeObserver = null

  function init() {
    if (!containerRef.value) return
    instance = echarts.init(containerRef.value)
    resizeObserver = new ResizeObserver(() => instance?.resize())
    resizeObserver.observe(containerRef.value)
  }

  function setOption(option, notMerge = true) {
    if (!instance) init()
    instance?.setOption(option, notMerge)
  }

  function clear() {
    instance?.clear()
  }

  function dispose() {
    resizeObserver?.disconnect()
    resizeObserver = null
    instance?.dispose()
    instance = null
  }

  function getInstance() { return instance }

  return { init, setOption, clear, dispose, getInstance }
}

export function baseLineOption(xData, seriesData, opts = {}) {
  return {
    tooltip: { trigger: 'axis', confine: true },
    legend: opts.legend ? { bottom: 0, textStyle: { fontSize: 12 } } : undefined,
    grid: { left: 50, right: 20, top: 15, bottom: opts.legend ? 40 : 30 },
    xAxis: { type: 'category', data: xData, axisLabel: { fontSize: 10, rotate: opts.rotate || 0 } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
    toolbox: { feature: { saveAsImage: { title: '导出' } } },
    series: Array.isArray(seriesData) ? seriesData : [seriesData]
  }
}

export function baseBarOption(xData, values, color = '#5470c6', orient = 'vertical') {
  const isHorizontal = orient === 'horizontal'
  return {
    tooltip: { trigger: 'axis', confine: true },
    grid: { left: isHorizontal ? 90 : 50, right: 20, top: 10, bottom: isHorizontal ? 10 : 40 },
    xAxis: isHorizontal
      ? { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } }
      : { type: 'category', data: xData, axisLabel: { rotate: 15, fontSize: 11 } },
    yAxis: isHorizontal
      ? { type: 'category', data: xData, axisLabel: { fontSize: 11 } }
      : { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
    toolbox: { feature: { saveAsImage: { title: '导出' } } },
    series: [{ type: 'bar', barWidth: '40%', data: values, itemStyle: { color, borderRadius: [4, 4, 0, 0] } }]
  }
}
