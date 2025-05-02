
// eslint-disable-next-line
import {
    PieChart as PieChartComponent,
    Pie,
    Cell,
    Legend,
    Tooltip,
  } from 'recharts'
  
  import './index.css'
  
  const COLORS = ['#00C49F', '#FF8042', '#FFBB28']
  
  const PieChart = props => {
    const {data} = props
  
    return (
      <div className="pie-chart-bg-container mt-2">
        <PieChartComponent width={400} height={350}>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            cx="50%"
            cy="50%"
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} matches`, 'Count']} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChartComponent>
      </div>
    )
  }
  
  export default PieChart
  