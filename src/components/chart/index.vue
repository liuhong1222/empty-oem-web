<template>
  <div style="height: 100%" ref="eChartsRef">
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          title: '',
          xData: [],
          series: [],
          otherOptions: {}
        }
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    }
  },
  watch: {
    chartData: {
      handler: function () {
        this.initChart()
      },
      deep: true
    }
  },
  data() {
    return {
      eCharts: null,
      axisOption: {
        title: { text: '' },
        legend: {
          textStyle: {
            color: '#333'
          },
          right: 20,
          top: 2
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            // interval: 'auto',
            // rotate: 45
          },
          data: []
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        color: [
          '#1890FF',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#c14089'
        ],
        series: []
      },
      normalOption: {
        tooltip: {
          trigger: 'item'
        },
        color: ['#1890FF', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
        series: []
      }
    }
  },
  methods: {
    initChart() {
      this.initChartData()
      if (this.eCharts) {
        this.eCharts.setOption(this.options)
      } else {
        this.eCharts = echarts.init(this.$refs.eChartsRef)
        this.eCharts.setOption(this.options)
      }
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.title.text = this.chartData.title
        if (this.chartData.title) {
          this.axisOption.title.text = this.chartData.title
        } else {
          this.axisOption.title.show = false
        }
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
        this.axisOption = {
          ...this.axisOption,
          ...(this.chartData.otherOptions || {})
        }
      } else {
        this.normalOption.series = this.chartData.series
      }
    },
    resizeCharts() {
      this.eCharts && this.eCharts.resize()
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeCharts)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeCharts)
  }
}
</script>

<style scoped>
</style>
