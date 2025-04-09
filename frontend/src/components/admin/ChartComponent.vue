<!-- <template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  
  export default {
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      },
      chartType: {
        type: String,
        default: 'bar'
      }
    },
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        Chart.register(...registerables);
        
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
          type: this.chartType,
          data: this.chartData,
          options: this.chartOptions
        });
      }
    },
    watch: {
      chartData: {
        handler(newData) {
          if (this.chart) {
            this.chart.data = newData;
            this.chart.update();
          }
        },
        deep: true
      }
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    height: 400px;
  }
  </style> -->