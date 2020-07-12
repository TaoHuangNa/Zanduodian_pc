// 导入 echarts
import echarts from 'echarts'
import _ from 'lodash'

// var o1 = { a: 1, b: 2 }
// var o2 = { a: 0, c: 7 }
// console.log(_.merge(o1, o2))

export default {
  data() {
    return {
      // 需要合并的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 当页面首次被渲染完毕以后，会触发mounted
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('初始化折线图失败！')
    const data = _.merge(res.data, this.options)
    // 绘制图表
    // myChart.setOption(/*填充自己的数据*/)
    myChart.setOption(data)
  },
  methods: {}
}
