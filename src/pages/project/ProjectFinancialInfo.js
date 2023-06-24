// style
import { calculateProjectProgress } from '../../components/progressBar/ProgressBar'
import './ProjectFinancialInfo.css'

export default function ProjectFinancialInfo({project}) {

  const financialInfo = calculateProjectProgress(project)

  const totalExcGst = financialInfo.totalCost
  const totalClaimed = financialInfo.totalClaimed
  const gst = totalExcGst * 0.15 // GST 15%
  const totalIncGst = totalExcGst * 1.15
  const stilltoclaim = totalIncGst - totalClaimed


  return (
      <div className="project-financial-info">
        <div>
          <FinancialData label='Total excluding GST' 
                          value={totalExcGst} />
          <FinancialData label='GST' 
                          value={gst} />
          <FinancialData label='Total including GST' 
                          value={totalIncGst} />
        </div>
        <div>
          <FinancialData label='Payment Claim to Date' 
                          value={totalClaimed} />
          <FinancialData label='Cost to Completion' 
                          value={stilltoclaim} />
        </div>
        
          
    </div>
  )
}

function FinancialData({label, value}) {
  return (
    <div className='financialData'>
      <span className='financialData-label'>{label}: </span>
      <NumberFormat number={value} prefix='$'/>
    </div>
  )
}

function numberWithCommas(x) {
  x = x.toFixed(2);
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}

export function NumberFormat({ number, prefix , className}) {
  number = numberWithCommas(parseFloat(number))
  
  return (
    <div className={'flex row-value ' + className} >
      <span>{prefix}</span>
      <span>{number}</span>
    </div>
  )
}

export { numberWithCommas }