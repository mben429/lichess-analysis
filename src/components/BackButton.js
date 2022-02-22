import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export function BackButton() {

    const navigate = useNavigate();

    const handleBackOnClick = () => {
        navigate("/");
    }

    return (
        <Button 
            className="general-btn" 
            variant="contained" 
            color="primary"
            onClick={() => {
                handleBackOnClick();
            }}
        >
            Back
        </Button>
    )

}