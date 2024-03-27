import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

import TipBar from '@/pages/TipBar'


export default function DrawPage() {
    const router = useRouter();
    const { sessionId, code } = router.query;
    const [hasDrawn, setHasDrawn] = useState(false);
    const [drawResult, setDrawResult] = useState(null);
    const [userInfo, setUserInfo] = useState({ userid: '', name: '' });
    const [sessionExists, setSessionExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authorizing, setAuthorizing] = useState(true);
    const [tipMessage, setTipMessage] = useState('');
    const [tipKey, setTipKey] = useState(0);

    const showTip = (message) => {
        setTipMessage(message);
        setTipKey(prevKey => prevKey + 1);
    };

    // 构造企业微信授权请求的URL
    const constructAuthUrl = () => {
        const CORP_ID = process.env.CORP_ID;
        const REDIRECT_URI = encodeURIComponent(window.location.href);
        const SCOPE = "snsapi_base";
        const STATE = "YOUR_CUSTOM_STATE";
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${CORP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`;
    };

    useEffect(() => {

        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (!code) {
            setAuthorizing(true);
            window.location.href = constructAuthUrl();
            return;
        }

        setAuthorizing(false);

        const fetchUserData = async () => {
            if (!sessionId) return;

            try {
                const userInfoResponse = await axios.get(`/app/lottery/api/userinfo?code=${code}`);
                const { userid, name } = userInfoResponse.data;
                setUserInfo({ userid, name });

                // 检查session是否存在
                const sessionResponse = await axios.get(`/app/lottery/api/checkSession?sessionId=${sessionId}`);
                setSessionExists(sessionResponse.data.exists);

                if (sessionResponse.data.exists) {
                    // 查询用户是否已经抽签
                    const drawResponse = await axios.get(`/app/lottery/api/checkDraw?sessionId=${sessionId}&userId=${userid}`);
                    const { hasDrawn, drawResult } = drawResponse.data;
                    setHasDrawn(hasDrawn);
                    if (hasDrawn) {
                        setDrawResult(drawResult);
                    }
                }
            } catch (error) {
                showTip('数据加载过程中出错: ' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [sessionId, code]);

    const handleDraw = () => {
        if (!userInfo.userid || !sessionId) {
            showTip("缺少必要的用户信息或会话ID" + userInfo.userid + sessionId);
            return;
        }

        axios.get(`/app/lottery/api/draw`, {
            params: {
                userId: userInfo.userid,
                sessionId: sessionId,
            }
        })
            .then((response) => {
                const { drawResult, message } = response.data;
                if (drawResult) {
                    setDrawResult(drawResult);
                    setHasDrawn(true);
                }
                showTip(message);
            })
            .catch((error) => {
                showTip('抽签过程中发生错误');
            });
    };

    if (authorizing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex items-center justify-center mb-5">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-700">正在跳转到企业微信授权页面...</span>
                </div>
                <p className="text-gray-600">请稍候</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {tipMessage && <TipBar key={tipKey} message={tipMessage} duration={5000} />}
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg text-gray-600 font-medium">加载中...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            {tipMessage && <TipBar key={tipKey} message={tipMessage} duration={5000} />}
            {sessionExists ? (
                <>
                    <div className="flex flex-col items-center justify-center">
                        {hasDrawn ? (
                            <div className="animate-fade-in-down duration-500 flex flex-col items-center justify-center mt-[-10%] max-w-xs mx-auto">
                                <h2 className='font-bold text-2xl w-full text-left ml-[.2px]'>抽签结果</h2>
                                <div className='relative rounded-lg bg-stone-200/60 w-full px-12'>
                                    <div className="block h-full w-full text-gray-800 align-middle font-bold text-center" style={{fontSize: 'calc(30vw + 10px)', maxWidth: '100%'}}>
                                        {drawResult}
                                    </div>
                                    <div>
                                        <p className="absolute bottom-0 right-0 text-md px-2 text-gray-400">{userInfo.name}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={handleDraw} className="w-[250px] h-[250px] shadow-md text-[48px] rounded-full bg-sky-600 outline-none hover:bg-sky-700 text-white font-bold flex items-center justify-center transform transition duration-300 ease-in-out hover:scale-110">
                                抽
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-lg text-gray-600">抽签活动不存在或已结束</p>
            )}
        </div>
    );

}
