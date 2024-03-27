import { useState } from 'react';
import axios from 'axios';

import TipBar from '@/pages/TipBar'

export default function Settings() {
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [message, setMessage] = useState('');
    const [tipKey, setTipKey] = useState(0);

    const showTip = (message) => {
        setMessage(message);
        setTipKey(prevKey => prevKey + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/app/lottery/api/settings', { range_start: Number(rangeStart), range_end: Number(rangeEnd) });
            setGeneratedLink(response.data.url);
            showTip('抽签链接已生成');
        } catch (error) {
            showTip('设置失败，请检查数据');
        }
    };

    const handleCopyLink = async () => {
        if (navigator.clipboard && generatedLink) {
            try {
                await navigator.clipboard.writeText(generatedLink);
                showTip('链接已复制到剪贴板');
            } catch (err) {
                showTip('复制链接失败');
            }
        } else {
            showTip('浏览器不支持复制到剪贴板');
        }
    };


    return (
        <div className="min-h-screen w-full flex flex-col px-10 py-6 justify-start items-center">
            {message && <TipBar key={tipKey} message={message} duration={5000} />}
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg mt-auto gap-2">
                {generatedLink && (
                    <div className="mt-4">
                        <label className="block uppercase tracking-wide text-gray-700 text-sm mb-2" htmlFor="generated-link">
                            生成的链接:
                        </label>
                        <div className="flex">
                            <input onClick={handleCopyLink} readOnly className="w-full h-10 cursor-pointer bg-stone-200 text-gray-700 border rounded py-2 px-3 leading-tight outline-none" id="generated-link" type="text" value={generatedLink} />
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                    <div className="w-full">
                        <label className="block uppercase tracking-wide text-gray-700 text-sm mb-2" htmlFor="range-start">
                            抽签范围开始
                        </label>
                        <input className="appearance-none block w-full h-10 bg-stone-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight outline-none focus:bg-white" id="range-start" type="number" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <label className="block uppercase tracking-wide text-gray-700 text-sm mb-2" htmlFor="range-end">
                            抽签范围结束
                        </label>
                        <input className="appearance-none block w-full h-10 bg-stone-200 text-gray-700 border rounded py-3 px-4 leading-tight outline-none focus:bg-white" id="range-end" type="number" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-center mt-2 w-full">
                    <button type="submit" className="shadow-sm w-full h-10 bg-sky-600 outline-none hover:bg-sky-700/80 focus:shadow-outline text-white py-2 px-4 rounded">
                        创建抽签
                    </button>
                </div>
            </form>
        </div>
    );
}
