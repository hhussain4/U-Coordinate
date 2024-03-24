import { useNavigate } from 'react-router-dom';
import '@styles/Settings.css'

const Settings: React.FC = () => {
    let navigate = useNavigate();
    return (
        <>
            <div className='header'>
                <button className='back-button' onClick={() => navigate(-1)}>
                    <i className='fa-solid fa-arrow-left'></i>
                </button>
                <h2>Settings</h2>
            </div>
            <div className='empty'>
                <p>No settings to display yet</p>
            </div>
        </>
    );
}

export default Settings;