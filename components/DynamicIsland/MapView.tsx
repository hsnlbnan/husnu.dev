// components/DynamicIsland/MapView.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CabLocation } from '@/app/types/cab.types';

interface MapViewProps {
  cabs: CabLocation[];
  showRoute?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ cabs, showRoute = false }) => {
  // Find nearest cab
  const nearestCab = useMemo(() => {
    if (!cabs.length) return null;

    const userLocation = { x: 200, y: 120 };
    return cabs.reduce((nearest, cab) => {
      const currentDistance = Math.sqrt(
        Math.pow(cab.x - userLocation.x, 2) +
        Math.pow(cab.y - userLocation.y, 2)
      );
      const nearestDistance = Math.sqrt(
        Math.pow(nearest.x - userLocation.x, 2) +
        Math.pow(nearest.y - userLocation.y, 2)
      );
      return currentDistance < nearestDistance ? cab : nearest;
    });
  }, [cabs]);


  const getRoutePath = () => {
    if (!nearestCab) return '';

    const userLocation = { x: 200, y: 100 };
    const horizontalRoads = [50, 100, 150, 200];
    const verticalRoads = [50, 100, 150, 200, 250, 300, 350];

    // Taksi ve kullanıcı için en yakın grid noktalarını bul
    const cabGridY = horizontalRoads.reduce((prev, curr) =>
      Math.abs(curr - nearestCab.y) < Math.abs(prev - nearestCab.y) ? curr : prev
    );
    const cabGridX = verticalRoads.reduce((prev, curr) =>
      Math.abs(curr - nearestCab.x) < Math.abs(prev - nearestCab.x) ? curr : prev
    );
    const userGridY = horizontalRoads.reduce((prev, curr) =>
      Math.abs(curr - userLocation.y) < Math.abs(prev - userLocation.y) ? curr : prev
    );
    const userGridX = verticalRoads.reduce((prev, curr) =>
      Math.abs(curr - userLocation.x) < Math.abs(prev - userLocation.x) ? curr : prev
    );

    // Rota: taksi orijinal konum -> taksi grid noktası -> kullanıcı grid noktası -> kullanıcı orijinal konum
    return [
      `M${nearestCab.x},${nearestCab.y}`,
      `L${cabGridX},${cabGridY}`,
      // grid üzerinde sadece yatay ve dikey hareket:
      cabGridX !== userGridX ? `L${userGridX},${cabGridY}` : null,
      cabGridY !== userGridY ? `L${userGridX},${userGridY}` : null,
      `L${userLocation.x},${userLocation.y}`
    ].filter(Boolean).join(' ');
  };




  return (
    <div className="relative w-full h-52 bg-gray-900 overflow-hidden">
      {/* Fake map roads */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d="M0,100 L400,100 M200,0 L200,200 M0,150 L400,150 M100,0 L100,200 M300,0 L300,200 M0,50 L400,50 M0,200 L400,200 M50,0 L50,200 M150,0 L150,200 M250,0 L250,200 M350,0 L350,200"
          stroke="#333"
          strokeWidth="2"
          fill="none"
        />

        {/* Route line */}
        {showRoute && nearestCab && (
          <motion.path
            d={getRoutePath()}
            stroke="#fbbf24"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        )}
      </svg>

      <motion.div
        className="absolute w-4 h-4 bg-yellow-400 rounded-full"
        style={{
          left: '192px',
          top: '92px',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Cabs */}
      {cabs.map((cab, index) => (
        <motion.div
          key={cab.id}
          className={`absolute text-2xl ${cab.id === nearestCab?.id ? 'text-yellow-400' : 'text-gray-500'}`}
          style={{
            left: `${Math.min(Math.max(cab.x, 0), 380)}px`,
            top: `${Math.min(Math.max(cab.y, 0), 180)}px`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0.9, }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1
          }}
        >
          <div className="rotate-90">
            <svg width="19" height="45.5" viewBox="0 0 114 268" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_ii_3_1819)">
                <path d="M6.21994 41.4253C6.0139 28.8132 13.8929 17.5463 25.7334 13.1397L26.5693 12.8286C43.8753 6.3879 62.8081 5.91837 80.3474 11.4949C91.9328 15.1784 99.9897 25.6608 100.562 37.8232C101.566 59.1816 103.24 95.5113 105.011 137.236C106.483 171.893 106.935 206.76 107.059 229.547C107.14 244.64 96.4922 257.64 81.7069 260.733L77.1937 261.677C66.4814 263.918 55.4612 264.189 44.6729 262.478L42.8916 262.196C28.0487 259.842 16.9087 247.454 16.0637 232.437C14.9082 211.9 13.0329 180.217 10.4441 141.617C7.57464 98.8308 6.56907 62.7965 6.21994 41.4253Z" fill="url(#paint0_linear_3_1819)" />
              </g>
              <path d="M18.1973 87.3929C15.7835 77.9994 21.081 67.9538 30.4197 65.2251L31.1815 65.0025C46.3839 60.5603 62.4517 60.1342 77.8132 63.7658C86.9161 65.9178 92.4374 75.3058 90.6763 84.5221C87.8863 99.1227 84.8129 121.942 86.0231 147.734C87.0286 169.162 91.0331 190.607 94.4521 205.63C96.9351 216.54 89.872 227.732 78.8123 229.587L76.9801 229.895C65.4469 231.83 53.7107 232.141 42.1133 230.82C31.6067 229.623 24.569 218.982 26.3148 208.529C28.6254 194.693 30.5856 174.454 28.6771 150.318C26.5967 124.007 21.8785 101.72 18.1973 87.3929Z" fill="#A7A5A5" />
              <g filter="url(#filter1_di_3_1819)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4775 49.5386C12.6317 34.9952 20.9351 21.7055 33.7745 14.8027C45.0858 8.72142 58.6069 7.99893 70.3968 12.9312C84.3 18.7475 93.6742 31.9155 94.5723 46.9919C95.0005 54.1797 95.4931 62.5522 96.0117 71.5642C96.0306 71.8926 95.5977 72.0541 95.3834 71.8045C95.1675 71.553 94.7704 71.7602 94.8222 72.0877C95.1358 74.0723 95.1432 76.1321 94.8064 78.1942C92.1656 94.3607 89.1433 120.552 90.5637 150.361C91.6899 173.996 96.1389 197.649 99.9917 214.4C100.692 217.446 100.743 220.513 100.235 223.44C100.218 223.535 100.34 223.591 100.4 223.514C100.455 223.443 100.57 223.483 100.569 223.573C100.473 228.986 100.367 233.632 100.277 237.215C100.153 242.09 97.131 246.398 92.6076 248.241L90.6447 249.041C71.4927 256.845 50.2197 257.531 30.6946 250.975C26.4633 249.554 23.4538 245.836 22.9877 241.39C22.5733 237.436 22.0136 232.007 21.3614 225.458C21.3231 225.073 21.86 224.886 22.0884 225.198C22.313 225.504 22.7819 225.28 22.7229 224.904C22.3525 222.549 22.3449 220.111 22.7507 217.684C25.3329 202.24 27.4747 179.873 25.3367 153.27C22.9059 123.024 17.2997 97.5366 13.0673 81.5968C12.8422 80.7491 12.6785 79.8961 12.5737 79.0433C12.5675 78.9935 12.4982 78.9863 12.4832 79.0342C12.4671 79.0856 12.3887 79.0741 12.3884 79.0202C12.3347 68.0528 12.3885 57.932 12.4775 49.5386ZM19.8154 83.2586C17.5503 74.3261 22.5684 64.819 31.4224 62.1689L32.1679 61.9457C47.1217 57.4698 62.973 57.0547 78.0895 60.743C86.7231 62.8495 91.953 71.7524 90.3052 80.5114C87.5818 94.9886 84.4982 118.041 85.7164 144.165C86.7298 165.897 90.7608 187.65 94.1249 202.63C96.4641 213.045 89.7313 223.694 79.1882 225.501L77.4113 225.806C66.013 227.759 54.4033 228.063 42.9391 226.708C32.9136 225.524 26.2024 215.401 27.8562 205.421C29.0673 193.969 30.9886 174.145 29.1209 150.534C27.0841 124.786 22.4577 102.953 18.8216 88.8395Z" fill="url(#paint1_linear_3_1819)" />
              </g>
              <g filter="url(#filter2_di_3_1819)">
                <path d="M13.7142 71.7529C13.4477 70.9339 13.9126 70.0484 14.7422 69.806L53.9948 58.3364C54.2446 58.2634 54.5087 58.2564 54.7611 58.3161L93.0206 67.3609C93.8558 67.5583 94.3574 68.4076 94.1321 69.2389C92.1743 76.4638 84.1912 108.693 86.0231 147.734C87.6392 182.174 97.002 216.657 99.2299 224.45C99.4792 225.322 98.9083 226.216 98.0116 226.366L59.8037 232.776C59.6653 232.8 59.5245 232.803 59.3854 232.787L23.609 228.711C22.6674 228.604 22.0508 227.677 22.314 226.764C24.4019 219.518 31.8347 190.253 28.6771 150.318C25.4709 109.769 15.9995 78.7752 13.7142 71.7529Z" fill="url(#paint2_linear_3_1819)" />
              </g>
              <g filter="url(#filter3_d_3_1819)">
                <g filter="url(#filter4_d_3_1819)">
                  <path d="M91.8833 31.7596C88.4116 25.1062 83.6873 23.4708 80.5029 23.511C79.4387 23.5244 79.096 24.7506 79.7821 25.5653C85.1986 31.9981 90.2313 42.2671 93.28 49.4998C93.8547 50.8632 95.6703 50.6279 95.6841 49.1495C95.7297 44.2686 94.9432 37.6239 91.8833 31.7596Z" fill="#FFEA00" />
                  <path d="M82.9552 26.061C86.896 31.278 90.5096 38.111 93.2309 44.0047C92.8274 40.5368 91.9313 36.7561 90.2126 33.2752L89.9526 32.7635C87.759 28.5597 85.1294 26.7514 82.9552 26.061Z" stroke="#FFEA00" stroke-width="4.35467" stroke-linecap="round" />
                </g>
              </g>
              <g filter="url(#filter5_d_3_1819)">
                <path d="M12.4204 35.7178C15.2616 28.3595 20.0225 26.1512 23.3261 25.8609C24.3859 25.7677 24.8607 26.9507 24.2688 27.8347C19.3503 35.179 15.2958 46.5764 12.989 54.4514C12.5733 55.8708 10.7363 55.8449 10.5491 54.3778C9.90318 49.3138 9.90413 42.2345 12.4204 35.7178Z" fill="#FFEA00" />
                <path d="M21.2112 28.5993C17.5904 34.6405 14.533 42.4963 12.3666 49.1103C12.3286 45.3239 12.795 41.0796 14.2394 37.0714L14.4513 36.5017C16.3074 31.6948 18.9628 29.5149 21.2112 28.5993Z" stroke="#FFEA00" stroke-width="4.35467" stroke-linecap="round" />
              </g>
              <g filter="url(#filter6_di_3_1819)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.6896 55.1775C17.7559 57.3441 12.8778 63.5684 12.6855 70.8199C12.6315 72.8559 12.5824 75.1283 12.5446 77.6199C13.0601 69.9622 18.1346 62.9601 25.838 60.7753L29.9076 59.6212C46.0745 55.0361 63.1238 54.7049 79.3984 58.6599L81.1304 59.0808C90.5036 61.3586 96.289 70.876 94.7113 80.4215C92.0755 96.3698 89.0974 121.971 90.4852 151.072C91.5816 174.063 95.9218 197.067 99.7302 213.52C99.8073 213.852 99.8766 214.185 99.9383 214.519C100.313 213.063 100.532 211.548 100.577 209.991C101.048 193.639 101.428 167.554 100.259 141.744C98.8326 110.252 96.7878 83.17 95.557 68.3412C94.9536 61.0705 89.811 55.0459 82.7547 53.2332L81.05 52.7952C63.5654 48.3035 45.1419 48.7866 27.8493 54.1901L24.6896 55.1775ZM22.4159 220.461C22.4204 219.253 22.5215 218.036 22.7252 216.822C25.274 201.638 27.3509 179.841 25.2582 153.982C22.8693 124.462 17.3561 99.5478 13.1483 83.8327C12.7792 82.4542 12.5723 81.0611 12.5167 79.6771C12.3324 95.0399 12.5982 117.853 14.6115 144.647C16.8509 174.451 19.0678 198.868 20.4876 213.676C20.7198 216.098 21.3887 218.386 22.4159 220.461Z" fill="url(#paint3_linear_3_1819)" />
              </g>
              <g filter="url(#filter7_ii_3_1819)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0561 55.6392C11.2372 40.5066 20.0006 26.7192 33.4636 19.7193C44.8161 13.8168 58.2369 13.1041 70.0398 17.8533C84.5796 23.7038 94.4381 37.3637 95.379 53.0475C95.8039 60.1306 96.2878 68.3004 96.7947 77.0546C96.806 77.2487 96.5511 77.3404 96.4311 77.1873C96.3097 77.0326 96.0666 77.1437 96.0925 77.3387C96.3433 79.2303 96.3183 81.1836 95.9852 83.1367C93.2476 99.1862 90.1594 124.875 91.5533 154.059C92.6345 176.695 96.9286 199.341 100.782 215.802C101.028 216.853 101.2 217.908 101.302 218.96C101.272 220.838 101.24 222.655 101.208 224.4C101.132 224.978 101.035 225.552 100.919 226.12C100.904 226.194 100.999 226.238 101.044 226.178C101.086 226.123 101.174 226.154 101.173 226.222C101.069 231.44 100.957 235.952 100.86 239.492C100.718 244.652 97.4806 249.2 92.6693 251.098L90.6856 251.881C71.1479 259.59 49.5922 260.295 29.6986 253.876C25.2051 252.426 21.9908 248.506 21.4885 243.803C21.1156 240.312 20.6348 235.74 20.0807 230.314C20.022 229.739 20.7884 229.424 21.1818 229.847C21.5845 230.279 22.2624 229.844 22.1126 229.272C21.2691 226.052 21.0714 222.623 21.6457 219.222C24.2153 204.002 26.2449 182.483 24.1629 157.066C21.7381 127.464 16.0975 102.473 11.7744 86.6683C11.3327 85.0537 11.1141 83.4177 11.1006 81.7986C11.1002 81.7507 11.036 81.7353 11.0147 81.7782C10.9932 81.8215 10.927 81.8061 10.9269 81.7577C10.9043 72.1341 10.9654 63.2199 11.0561 55.6392ZM18.8216 88.8395C16.4064 79.465 21.7014 69.4198 31.0306 66.7118L31.7844 66.493C46.8025 62.1336 62.6607 61.7081 77.8316 65.2574C86.9228 67.3844 92.4355 76.7642 90.6667 85.9644C87.9006 100.352 84.8769 122.709 86.0558 147.959C87.0348 168.928 90.955 189.912 94.3262 204.688C96.8076 215.563 89.761 226.735 78.7311 228.576L76.9134 228.88C65.5366 230.779 53.9633 231.089 42.525 229.803C32.0508 228.625 25.0371 218.007 26.7843 207.586C29.0673 193.969 30.9886 174.145 29.1209 150.534C27.0841 124.786 22.4577 102.953 18.8216 88.8395Z" fill="url(#paint4_linear_3_1819)" />
              </g>
              <g filter="url(#filter8_ii_3_1819)">
                <path d="M24.3298 114.582C43.8454 106.098 65.7768 104.986 86.0506 111.452L86.7571 111.677C86.7571 111.677 85.6117 124.891 86.8697 152.807C88.7864 180.519 91.7549 192.872 91.7549 192.872L89.398 193.499C69.4699 198.801 48.5974 199.505 28.3576 195.556C28.3576 195.556 29.9126 174.101 28.9264 155.392C28.0789 139.315 24.3298 114.582 24.3298 114.582Z" fill="url(#paint5_linear_3_1819)" />
              </g>
              <defs>
                <filter id="filter0_ii_3_1819" x="6.21606" y="1.82365" width="105.198" height="261.763" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="4.35467" dy="-5.80623" />
                  <feGaussianBlur stdDeviation="17.4187" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_1819" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="-0.725779" />
                  <feGaussianBlur stdDeviation="1.45156" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="effect1_innerShadow_3_1819" result="effect2_innerShadow_3_1819" />
                </filter>
                <filter id="filter1_di_3_1819" x="9.46383" y="9.67969" width="91.8597" height="248.661" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="0.750549" />
                  <feGaussianBlur stdDeviation="0.375275" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.925374 0 0 0 0 0.925374 0 0 0 0 0.925374 0 0 0 0.37 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_1819" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_1819" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="-2.90311" dy="3.62889" />
                  <feGaussianBlur stdDeviation="1.45156" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3_1819" />
                </filter>
                <filter id="filter2_di_3_1819" x="10.7358" y="58.2759" width="89.3033" height="177.424" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="0.750549" />
                  <feGaussianBlur stdDeviation="0.375275" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.925374 0 0 0 0 0.925374 0 0 0 0 0.925374 0 0 0 0.37 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_1819" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_1819" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="-2.90312" dy="3.62889" />
                  <feGaussianBlur stdDeviation="1.45156" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3_1819" />
                </filter>
                <filter id="filter3_d_3_1819" x="77.975" y="20.6071" width="19.1625" height="29.7945" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="-1.45156" />
                  <feGaussianBlur stdDeviation="0.725779" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_1819" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_1819" result="shape" />
                </filter>
                <filter id="filter4_d_3_1819" x="78.7007" y="23.5103" width="17.711" height="28.3429" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="0.725779" />
                  <feGaussianBlur stdDeviation="0.362889" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_1819" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_1819" result="shape" />
                </filter>
                <filter id="filter5_d_3_1819" x="8.73643" y="22.9526" width="17.2417" height="32.5447" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="-1.45156" />
                  <feGaussianBlur stdDeviation="0.725779" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_1819" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_1819" result="shape" />
                </filter>
                <filter id="filter6_di_3_1819" x="9.5649" y="49.7485" width="92.219" height="173.616" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="0.750549" />
                  <feGaussianBlur stdDeviation="0.375275" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.925374 0 0 0 0 0.925374 0 0 0 0 0.925374 0 0 0 0.37 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_1819" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_1819" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="-2.90311" dy="3.62889" />
                  <feGaussianBlur stdDeviation="1.45156" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
                  <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3_1819" />
                </filter>
                <filter id="filter7_ii_3_1819" x="10.9221" y="8.92717" width="94.7341" height="249.297" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="4.35467" dy="-5.80623" />
                  <feGaussianBlur stdDeviation="17.4187" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_1819" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="-0.725779" />
                  <feGaussianBlur stdDeviation="1.45156" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                  <feBlend mode="normal" in2="effect1_innerShadow_3_1819" result="effect2_innerShadow_3_1819" />
                </filter>
                <filter id="filter8_ii_3_1819" x="24.3298" y="101.491" width="71.7797" height="96.5824" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="4.35467" dy="-5.80623" />
                  <feGaussianBlur stdDeviation="17.4187" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_1819" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="-0.725779" />
                  <feGaussianBlur stdDeviation="1.45156" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="effect1_innerShadow_3_1819" result="effect2_innerShadow_3_1819" />
                </filter>
                <linearGradient id="paint0_linear_3_1819" x1="53.6918" y1="252.983" x2="-14.3852" y2="240.151" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFBB00" />
                  <stop offset="1" stop-color="#FFC400" />
                </linearGradient>
                <linearGradient id="paint1_linear_3_1819" x1="122.172" y1="722.729" x2="-96.9178" y2="662.921" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E8EAE9" />
                  <stop offset="0.498386" stop-color="#707072" />
                  <stop offset="1" stop-color="#2F3032" />
                </linearGradient>
                <linearGradient id="paint2_linear_3_1819" x1="104.785" y1="565.254" x2="-92.9231" y2="482.901" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E8EAE9" />
                  <stop offset="0.498386" stop-color="#707072" />
                  <stop offset="1" stop-color="#2F3032" />
                </linearGradient>
                <linearGradient id="paint3_linear_3_1819" x1="114.908" y1="539.647" x2="-88.0366" y2="453.23" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E8EAE9" />
                  <stop offset="0.498386" stop-color="#707072" />
                  <stop offset="1" stop-color="#2F3032" />
                </linearGradient>
                <linearGradient id="paint4_linear_3_1819" x1="55.9408" y1="246.949" x2="-5.06468" y2="237.236" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFBB00" />
                  <stop offset="1" stop-color="#FFC400" />
                </linearGradient>
                <linearGradient id="paint5_linear_3_1819" x1="83.3211" y1="216.816" x2="14.0658" y2="195.862" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F7B601" />
                  <stop offset="0.350909" stop-color="#F5B401" />
                  <stop offset="1" stop-color="#F8B601" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
