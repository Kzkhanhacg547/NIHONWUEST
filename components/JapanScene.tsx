/** Lightweight vector illustration: no remote assets, fixed aspect ratio avoids CLS. */
export function JapanScene() {
  return (
    <svg
      viewBox="0 0 600 660"
      fill="none"
      role="img"
      aria-label="Núi Phú Sĩ và cổng Torii dưới mặt trời đỏ"
      className="nq-scene"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="660" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8e5db" />
          <stop offset="1" stopColor="#d2d8cd" />
        </linearGradient>
        <linearGradient
          id="mountain"
          x1="300"
          y1="270"
          x2="300"
          y2="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5d797b" />
          <stop offset="1" stopColor="#283f44" />
        </linearGradient>
        <pattern id="lines" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0v6" stroke="#233a3e" strokeOpacity=".035" />
        </pattern>
      </defs>
      <path fill="url(#sky)" d="M0 0h600v660H0z" />
      <circle cx="355" cy="207" r="116" fill="#da4b3d" />
      <path d="M-40 481L292 236L642 487V660H0Z" fill="url(#mountain)" />
      <path
        d="m292 236-95 71 36-4 20 19 38-21 34 21 26-16 42 10Z"
        fill="#f6f2e6"
      />
      <path
        d="M0 410c96-65 157-30 222 14s111 58 208 5 127-40 170-6v237H0Z"
        fill="#91a09a"
      />
      <path
        d="M0 506c115-80 204-24 299 6s185-71 301-32v180H0Z"
        fill="#536e6c"
      />
      <path
        d="M0 575c111-61 218-10 298 7s173-35 302-24v102H0Z"
        fill="#244548"
      />
      <path
        d="M-20 358h151m326 12h155M35 183h100m-55 12h95M439 288h125"
        stroke="#fffaf0"
        strokeOpacity=".45"
        strokeWidth="2"
      />
      <g fill="#ae3e32">
        <path d="M137 391h326v17H137zM165 428h271v14H165zM185 400h19v180h-19zM399 400h19v180h-19z" />
        <path d="m122 375 16 19h325l16-19c-106 14-233 14-357 0Z" />
      </g>
      <path
        d="M126 375c112 14 233 14 349 0"
        stroke="#293e3c"
        strokeWidth="10"
      />
      <path d="M296 404h13v35h-13z" fill="#71382c" />
      <path d="m220 660 68-106h30l64 106" fill="#b8b6a4" />
      <path d="M0 0h600v660H0z" fill="url(#lines)" />
      <g stroke="#f3eee1" strokeOpacity=".25">
        <path d="M28 0v660M572 0v660M0 52h600M0 608h600" />
      </g>
    </svg>
  );
}
