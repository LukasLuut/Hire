import BtnLogin from '../../components/Button'
import './index.css'



function Login() {
  return (
    <div id='body'>
        <div className='box1'>
            <div id='logo1' className='box2'></div>
        </div>
        <div className='box1'>  
            <div id='logo2' className='box2'>
              <div id='bg-glass'>
                <BtnLogin/>
              </div>
            </div> 
        </div>
    </div>
  )
}

export default Login