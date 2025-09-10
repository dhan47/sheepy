import svgPaths from "./svg-k1bkmald5a";
import imgChatGptImage2025921243311 from "figma:asset/3b01a3d12410c4c5da13595e5715a491a06fdce6.png";

function Sheepy() {
  return (
    <div className="absolute h-[180.342px] translate-x-[-50%] translate-y-[-50%] w-[656.383px]" data-name="Sheepy" style={{ top: "calc(50% + 0.171px)", left: "calc(50% + 191.192px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 657 181">
        <g id="Sheepy">
          <path d={svgPaths.p228c40c0} fill="var(--fill-0, #0D2A72)" id="Vector" />
          <path d={svgPaths.p3dc7c180} fill="var(--fill-0, #0D2A72)" id="Vector_2" />
          <path d={svgPaths.p2178c800} fill="var(--fill-0, #0D2A72)" id="Vector_3" />
          <path d={svgPaths.p175f0380} fill="var(--fill-0, #0D2A72)" id="Vector_4" />
          <path d={svgPaths.p3a67f100} fill="var(--fill-0, #0D2A72)" id="Vector_5" />
          <path d={svgPaths.p11e5f100} fill="var(--fill-0, #0D2A72)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents translate-x-[-50%] translate-y-[-50%]" style={{ top: "calc(50% + 0.171px)", left: "calc(50% + 191.192px)" }}>
      <Sheepy />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents left-[-40.77px] top-[-27.08px]">
      <div className="absolute flex h-[452.227px] items-center justify-center left-[-40.77px] top-[-27.08px] w-[423.927px]">
        <div className="flex-none rotate-[345.213deg]">
          <div className="bg-[7.5%_7.73%] bg-no-repeat bg-size-[351.89%_314.57%] h-[378.353px] w-[338.59px]" data-name="ChatGPT Image 2025년 9월 2일 오후 12_43_31 1" style={{ backgroundImage: `url('${imgChatGptImage2025921243311}')` }} />
        </div>
      </div>
      <div className="absolute flex h-[16.239px] items-center justify-center left-[285.27px] top-[366.85px] w-[46.929px]">
        <div className="flex-none rotate-[345.213deg]">
          <div className="bg-[#fdfaf7] h-[4.282px] w-[47.409px]" />
        </div>
      </div>
      <div className="absolute flex h-[20.374px] items-center justify-center left-[200.1px] top-[385.19px] w-[62.595px]">
        <div className="flex-none rotate-[345.213deg]">
          <div className="bg-[#fdfaf7] h-[4.282px] rounded-[152.932px] w-[63.62px]" />
        </div>
      </div>
      <div className="absolute flex h-[20.374px] items-center justify-center left-[117px] top-[407.13px] w-[62.595px]">
        <div className="flex-none rotate-[345.213deg]">
          <div className="bg-[#fdfaf7] h-[4.282px] rounded-[152.932px] w-[63.62px]" />
        </div>
      </div>
    </div>
  );
}

function Slide16912() {
  return (
    <div className="absolute bg-[#0d2a72] left-[440px] overflow-clip rounded-[74.766px] size-[319px] top-[381px]" data-name="Slide 16:9 - 12">
      <Group27 />
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents translate-x-[-50%] translate-y-[-50%]" style={{ top: "calc(50% + 0.5px)", left: "calc(50% - 0.308px)" }}>
      <Group28 />
      <Slide16912 />
    </div>
  );
}

export default function Slide16917() {
  return (
    <div className="relative size-full" data-name="Slide 16:9 - 17">
      <Group29 />
    </div>
  );
}