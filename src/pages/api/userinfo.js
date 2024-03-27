import axios from 'axios';

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: '缺少必要的code参数' });
    }

    const CORP_ID = process.env.CORP_ID;
    const CORP_SECRET = process.env.CORP_SECRET;

    try {
        // 获取access_token
        const tokenResponse = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`);
        const { access_token } = tokenResponse.data;

        // 使用access_token和code获取用户信息（基础信息，包含UserId）
        const userInfoResponse = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${access_token}&code=${code}`);
        const userInfo = userInfoResponse.data;

        // 检查是否成功获取到UserId
        if (userInfo.UserId) {
            const userDetailsResponse = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}&userid=${userInfo.UserId}`);
            const userDetails = userDetailsResponse.data;

            return res.status(200).json(userDetails);
        } else {
            return res.status(400).json({ error: '无法获取用户 userid' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '内部服务器错误' });
    }
}
