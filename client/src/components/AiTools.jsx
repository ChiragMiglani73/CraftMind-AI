import React from 'react';
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24 bg-[#0f0f1b] text-white py-16'>

      <div className='text-center'>
        <h2 className='text-[42px] font-semibold text-white'>Powerful AI Tools</h2>
        <p className='text-gray-400 max-w-lg mx-auto'>
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index) => (
      <div
  key={index}
  className='p-8 m-4 max-w-xs rounded-xl bg-[#1f2233] border border-white/10 transition-all duration-300 cursor-pointer shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:shadow-[0_18px_32px_rgba(0,0,0,0.5)]'
  onClick={() => user && navigate(tool.path)}
>
  <tool.Icon
    className='w-12 h-12 p-3 text-white rounded-xl'
    style={{
      background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`
    }}
  />
  <h3 className='mt-6 mb-3 text-lg font-semibold text-white'>{tool.title}</h3>
  <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
</div>


        ))}
      </div>
    </div>
  );
};

export default AiTools;
