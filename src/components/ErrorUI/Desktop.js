import './Desktop.scss'
import logo from '../../assets/images/logo.svg'

const Desktop = () => {
    return (
        <div className="Desktop">
            <div className='wrapper'>
                <div className='copy'>
                    <h2>Experience only
                        <br/>
                        <b>Available on mobile</b>
                    </h2>
                </div>
                <img className='logo' src={logo} alt="" />
            </div>
        </div>
    );
}

export default Desktop;