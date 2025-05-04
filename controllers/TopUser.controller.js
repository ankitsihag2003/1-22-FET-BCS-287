import axios from "axios";

const baseUrl = "http://20.244.56.144/evaluation-service"

async function getAuthToken() {
    const authUrl = "http://20.244.56.144/evaluation-service/auth"; // example path, confirm this
    const clientID = "d3c9811d-dc7d-4d51-9cad-6b57f1451dcd";
    const clientSecret = "rdQRMHVapvFNggvt";
    const email= "ankitsihag2003@gmail.com";
    const name = "Ankit Sihag";
    const accessCode="hFhJhm";
    const rollNo="1/22/FET/BCS/287";

    const response = await axios.post(authUrl, {
        email,
        name,
        rollNo,
        accessCode,
        clientID,
        clientSecret
    });

    return response.data.access_token;
}


export const getTopUser = async (req,res) => {
    try {
        const accessToken = await getAuthToken();
        const users = await axios.get(`${baseUrl}/users`,{headers:{Authorization:`Bearer ${accessToken}`}});   //fetching all users
        const userData = Object.entries(users.data.users).map(([id, name]) => ({
            id,
            name
          }));   // extracting user data from response
        if(userData.length === 0) {
            return res.status(200).json([]);   //if no users found, return an empty array
        }
        console.log(userData);
        const userComment = await Promise.all(userData.map(async user => {
            const userPosts = await axios.get(`${baseUrl}/users/${user.id}/posts`,{headers:{Authorization:`Bearer ${accessToken}`}});  //fetching posts for each user
            const postData = userPosts.data.posts;   // extracting post data from response

            let totalComments = 0;
            for (let post of postData) {
                const commentRes = await axios.get(`${baseUrl}/posts/${post.id}/comments`,{headers:{Authorization:`Bearer ${accessToken}`}});  //fetching comments for each post
                totalComments += commentRes.data.comments.length;   //summing up total comments for each user
            }

            return { user, totalComments };
        }));

        userComment.sort((a, b) => b.totalComments - a.totalComments);  //sorting users by total comments in descending order
        const TopUsers =  userComment.slice(0, 5).map(entry => entry.user);  //returning top 5 users
        return res.status(200).json(TopUsers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}