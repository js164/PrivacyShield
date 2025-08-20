import axios from 'axios';

const getMyUniversityList = async () => {
    try {
        const response = await axios.get('/question/questions');
        if (response.status == 200) {
            return response.data;
        }else{
            return null
        }
        
    } catch (err) {
        console.error(err);
        throw err; 
    }
};

export default getMyUniversityList;
