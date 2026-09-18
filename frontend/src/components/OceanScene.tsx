import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import './ocean-scene.css';

/** A small vector diorama: no canvas, model downloads or WebGL runtime. */
export function OceanScene() {
  const scene = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!scene.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, []);

  const resetTilt = () => {
    scene.current?.style.setProperty('--tilt-x', '0deg');
    scene.current?.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={scene}
      className={`ocean-scene ${paused || !visible ? 'is-paused' : ''}`}
      onPointerMove={(event) => {
        if (paused || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - rect.top) / rect.height) * 4}deg`);
        event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`);
      }}
      onPointerLeave={resetTilt}
    >
      <div className="scene-tilt">
        <svg viewBox="0 0 640 500" className="island-diorama" role="img" aria-label="Mô hình đảo nhỏ bên biển xanh, có cây dừa, ngọn hải đăng, máy bay và nắng sớm">
          <defs>
            <linearGradient id="sea-depth" x1="0" x2="0.9" y1="0" y2="1">
              <stop stopColor="#87cddf" /><stop offset="1" stopColor="#499bbf" />
            </linearGradient>
            <linearGradient id="sand-depth" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#f5dda5" /><stop offset="1" stopColor="#e7bb81" />
            </linearGradient>
            <linearGradient id="sea-surface" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#c9f0f4" /><stop offset="1" stopColor="#8bd4e7" />
            </linearGradient>
          </defs>
          <ellipse cx="324" cy="448" rx="226" ry="26" fill="#d8eaf3" opacity=".65" />
          <circle cx="497" cy="93" r="46" fill="#f9e7a8" />
          <circle cx="497" cy="93" r="34" fill="#f7dc94" />
          <g className="scene-cloud cloud-one">
            <path d="M68 141c-23 0-23-24-5-27-3-25 30-33 40-14 12-13 37-5 35 14 25 0 27 27 3 27Z" fill="#d8eaf3" transform="translate(1 7)" />
            <path d="M68 141c-23 0-23-24-5-27-3-25 30-33 40-14 12-13 37-5 35 14 25 0 27 27 3 27Z" fill="#fff" />
          </g>
          <g className="scene-cloud cloud-two">
            <path d="M401 169c-16 0-20-22-2-27-1-20 27-29 36-11 13-12 33-3 33 12 20 1 19 26 0 26Z" fill="#d8eaf3" transform="translate(0 5)" />
            <path d="M401 169c-16 0-20-22-2-27-1-20 27-29 36-11 13-12 33-3 33 12 20 1 19 26 0 26Z" fill="#fff" />
          </g>
          <path d="M113 192C168 81 280 58 385 112" fill="none" stroke="#78adc3" strokeWidth="1.5" strokeDasharray="5 8" />
          <g className="scene-plane">
            <path d="m312 86 74 17 8 11-49-2-35 18-12-3 24-18-25-7-12 7-11-2 13-14-3-15 10 1 11 14Z" fill="#94c6d8" transform="translate(1 7)" />
            <path d="m312 86 74 17 8 11-49-2-35 18-12-3 24-18-25-7-12 7-11-2 13-14-3-15 10 1 11 14Z" fill="#fff" stroke="#d8eaf3" />
            <path d="m314 86 15-20 11 3-8 21" fill="#e4f3f8" />
            <path d="m368 101 10 3" stroke="#28799d" strokeWidth="4" strokeLinecap="round" />
          </g>
          <path d="m92 273 224-100c13-6 28-5 39 0l229 105v27c0 10-6 16-18 22L347 438c-13 6-28 6-41 0L86 338c-10-5-15-12-15-23v-25Z" fill="url(#sea-depth)" />
          <path d="m87 272 229-106c13-6 28-6 41 0l221 102c17 8 17 22 0 30L349 409c-13 6-28 6-41 0L88 309c-22-10-22-27-1-37Z" fill="url(#sea-surface)" stroke="#def5fa" strokeWidth="2" />
          <path d="m91 319 219 99c12 6 25 6 37 0l220-106" fill="none" stroke="#b8e6ef" strokeWidth="2" opacity=".65" />
          <g className="scene-waves" fill="none" stroke="#f4fdff" strokeWidth="3" strokeLinecap="round">
            <path d="m124 284 31 14m4 36 23 10m226 35 39-19m68-62 34-17m-137-80 26 12" />
            <path d="m256 363 18 8m185-35 16-8m-334-23 13 6" strokeWidth="2" />
          </g>
          <ellipse cx="335" cy="288" rx="159" ry="76" fill="#6cbdcb" opacity=".25" />
          <path d="M197 264c15-31 72-64 128-65 62-2 134 31 150 62v22c-7 32-55 60-123 64-77 6-145-12-159-40Z" fill="url(#sand-depth)" />
          <path d="M198 256c31-38 76-58 127-59 69-1 131 23 150 55 20 35-29 73-107 80-78 8-151-9-173-40-9-12-6-24 3-36Z" fill="#f9e7b7" />
          <path d="M226 243c38-31 72-39 114-37 46 1 86 16 106 38 26 30-22 47-75 50-67 3-125-4-147-25-8-7-10-17 2-26Z" fill="#a8c9ab" />
          <path d="M257 236c34-19 93-26 139-5 24 11 21 20-3 29-35 14-98 9-132-4-16-6-17-12-4-20Z" fill="#bcd6b5" />
          <path d="M353 245c-4 18-31 20-22 36 6 9 36 5 49 17 6 7 3 19-6 25" fill="none" stroke="#fff2d3" strokeWidth="12" strokeLinecap="round" />
          <ellipse cx="311" cy="251" rx="36" ry="12" fill="#7aafaa" opacity=".3" />
          <g>
            <path d="m295 246 7-87 24-1 10 89c-11 7-29 6-41-1Z" fill="#fff8e8" />
            <path d="m316 160 10-2 10 89-15 4Z" fill="#c6dbe0" />
            <path d="m299 205 30-1 3 18-35 1Z" fill="#e9a57b" />
            <path d="m304 185 6-1v10h-7Z" fill="#477a8e" />
            <path d="m306 247 1-15a5 5 0 0 1 10 0l1 17Z" fill="#477a8e" />
            <path d="m294 157 21-12 20 11-1 8-20 9-20-8Z" fill="#659db0" />
            <path d="m298 136 17-9 15 8v22l-15 8-17-8Z" fill="#f5df9b" />
            <path d="m315 129 15 6v22l-15 8Z" fill="#d7c383" />
            <path d="M293 137v-5l22-17 23 17v5l-23 9Z" fill="#5a8b9c" />
            <path d="m300 148 28-1m-13-15v30" stroke="#6a8d97" strokeWidth="2" />
          </g>
          <g>
            <path d="M237 280q8-44 4-78" stroke="#b59062" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M240 208c-23-27-46-21-56 1 22-9 41-9 56-1Z" fill="#4d9d85" />
            <path d="M241 207c-3-37-29-44-45-34 23 6 34 18 45 34Z" fill="#6aaf8f" />
            <path d="M241 205c16-32 44-24 51-11-22-6-34-1-51 11Z" fill="#519780" />
            <path d="M243 207c33-12 47 8 43 28-11-18-26-23-43-28Z" fill="#78b99b" />
            <path d="M241 205c-9-27 6-45 20-45-11 15-15 28-20 45Z" fill="#71b99a" />
          </g>
          <g>
            <ellipse cx="419" cy="293" rx="24" ry="9" fill="#d2b881" opacity=".45" />
            <path d="m418 252 1 39" stroke="#aa805e" strokeWidth="3" />
            <path d="M389 259q6-28 29-32 24 8 32 28l-14 5-17-4-14 7Z" fill="#f6c98b" />
            <path d="M419 227q-15 13-14 36l14-7 17 4q-3-22-17-33Z" fill="#fff4d7" />
            <path d="m401 304 22-8 16 7-22 10Z" fill="#fff8e8" />
            <path d="m409 302 17 6" stroke="#e9b182" strokeWidth="4" />
          </g>
          <g className="scene-boat">
            <ellipse cx="178" cy="348" rx="28" ry="10" fill="#7dc1d4" opacity=".35" />
            <path d="m153 338 28-8 22 10-18 12-23-4Z" fill="#fef9ee" />
            <path d="m156 341 29 10 16-10-16 17-23-8Z" fill="#d99670" />
            <path d="m178 327 1-52" stroke="#5e7a8a" strokeWidth="2" />
            <path d="m175 278-24 43 25 4Z" fill="#fff" />
            <path d="m182 290 16 33-16 3Z" fill="#f9e7a8" />
          </g>
          <g className="scene-pin">
            <path d="M468 219c-8-11-24-27-24-42a24 24 0 0 1 48 0c0 15-16 31-24 42Z" fill="#cd9773" transform="translate(5 4)" />
            <path d="M468 219c-8-11-24-27-24-42a24 24 0 0 1 48 0c0 15-16 31-24 42Z" fill="#ffd9b3" />
            <circle cx="468" cy="176" r="9" fill="#fff9ec" />
          </g>
        </svg>
        <div className="scene-caption"><span className="scene-caption-mark" aria-hidden="true" /><div><strong>Một chút biển, một chút nắng.</strong><span>Phần còn lại là hành trình của bạn.</span></div></div>
      </div>
      <button className="scene-motion-toggle" type="button" aria-pressed={paused} onClick={() => { setPaused(!paused); resetTilt(); }}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        {paused ? 'Bật chuyển động' : 'Dừng chuyển động'}
      </button>
    </div>
  );
}
