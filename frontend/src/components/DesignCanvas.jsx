import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Palette, Trash2, Undo, Redo, Sparkles,
  Move, Info, Settings, CheckCircle2, X, Menu
} from 'lucide-react';
import { assets } from '../assets/assets';

// ============================================================================
// SVG GARMENT TEMPLATES - CORRECTED FROM ACTUAL SVG FILES
// ============================================================================

const SVG_TEMPLATES = {
  Kurta: {
    viewBox: "0 0 1024 1024",
    zones: [
      {
        id: 'body',
        label: 'Body',
        path: `M740.253,455.967 C742.885,476.351 744.987,496.348 747.375,516.306 C749.428,533.468 751.345,550.663 753.23,567.853 C753.555,570.815 752.563,572.602 749.511,573.269 C729.012,577.749 708.48,581.803 687.318,581.342 C682.805,581.243 680.834,579.861 680.345,575.177 C678.292,555.512 676.151,535.85 673.579,516.247 C671.093,497.296 667.862,478.444 665.288,459.503 C663.072,443.202 659.286,427.112 658.656,410.6 C658.596,409.039 658.249,407.502 657.283,406.393 C653.549,402.104 653.452,397.032 653.699,391.786 C654.216,380.846 651.957,370.263 649.318,359.749 C649.064,358.735 649.098,357.393 647.361,356.73 C647.361,365.174 647.005,373.45 647.425,381.686 C648.932,411.276 652.357,440.69 655.854,470.1 C658.288,490.579 659.922,511.153 662.409,531.624 C666.504,565.334 667.749,599.272 670.94,633.056 C673.365,658.728 674.532,684.517 676.365,710.246 C678.542,740.785 680.923,771.309 683.039,801.852 C684.304,820.118 685.182,838.411 686.325,856.687 C687.29,872.135 688.234,887.587 689.519,903.01 C689.88,907.349 689.274,909.558 684.38,908.487 C680.867,907.718 679.645,909.717 680.264,912.715 C681.855,920.416 677.869,924.089 671.409,927.073 C651.459,936.29 630.515,942.251 609.028,946.188 C568.737,953.57 528.002,955.983 487.157,953.918 C451.24,952.102 415.454,948.393 380.92,937.305 C370.777,934.048 360.631,930.782 351.194,925.659 C346.424,923.07 343.689,919.871 345.359,914.053 C346.534,909.958 345.191,907.56 340.397,908.295 C336.271,908.928 335.304,906.923 335.592,903.068 C337.02,883.983 338.281,864.886 339.522,845.788 C340.634,828.679 341.534,811.557 342.726,794.454 C344.219,773.04 345.952,751.643 347.509,730.234 C348.62,714.961 349.543,699.674 350.675,684.403 C352.09,665.326 353.657,646.26 355.113,627.186 C356.024,615.242 356.749,603.282 357.735,591.345 C359.515,569.801 360.801,548.218 363.4,526.739 C365.456,509.746 366.95,492.685 368.716,475.656 C370.481,458.633 372.354,441.621 374.028,424.589 C375.052,414.172 376.064,403.74 376.588,393.29 C377.205,380.996 378.477,368.709 377.583,356.022 C372.772,367.581 371.392,379.389 372.005,391.471 C372.269,396.681 371.151,401.367 368.217,405.652 C367.27,407.036 366.545,408.504 366.353,410.226 C362.054,448.746 355.376,486.938 350.48,525.375 C348.337,542.198 346.277,559.031 344.388,575.884 C343.97,579.612 342.454,581.147 338.746,581.242 C317.432,581.791 296.63,578.469 276.05,573.275 C272.38,572.349 271.49,570.253 271.936,566.648 C274.612,545.038 277.129,523.407 279.675,501.78 C282.629,476.692 285.652,451.611 288.466,426.507 C290.354,409.662 291.573,392.735 293.769,375.933 C295.317,364.085 298.226,352.422 300.137,340.614 C307.682,293.982 317.149,247.736 327.894,201.75 C332.558,181.792 337.578,161.934 349.196,144.497 C352.344,139.773 356.081,136.16 361.168,133.581 C383.916,122.046 407.311,111.94 430.656,101.718 C437.363,98.781 443.998,95.682 450.716,92.773 C453.055,91.761 454.423,89.953 455.401,87.82 C457.136,84.041 459.034,80.287 460.252,76.334 C462.076,70.417 466.056,67.376 471.778,65.809 C479.372,63.73 487.116,62.656 494.926,62.218 C514.083,61.145 533.181,61.102 552.067,65.482 C558.325,66.933 562.612,70.091 564.711,76.172 C565.036,77.113 565.58,77.979 565.899,78.922 C568.609,86.953 573.529,91.421 581.765,95.475 C601.326,105.103 621.682,112.917 641.108,122.768 C648.828,126.683 656.711,130.279 664.565,133.921 C670.244,136.555 674.001,140.918 677.217,146.204 C687.883,163.735 692.329,183.377 697.321,202.906 C704.139,229.572 709.092,256.633 714.607,283.564 C720.407,311.878 725.612,340.337 730.121,368.884 C733.331,389.208 734.952,409.782 737.293,430.244 C738.257,438.669 739.249,447.092 740.253,455.967z`
      },
      {
        id: 'collar',
        label: 'Collar',
        path: `M523.314,207.5 C523.287,248.164 523.262,288.827 523.228,329.49 C523.224,333.93 517.239,342.853 513.426,344.065 C512.849,344.248 512.09,344.224 511.521,344.011 C507.685,342.577 501.638,333.679 501.704,329.422 C502.095,304.114 501.06,278.819 501.457,253.499 C502.054,215.347 501.584,177.179 501.764,139.018 C501.786,134.464 500.594,132.391 495.909,131.033 C478.547,126.001 463.867,117.02 455.369,100.229 C453.658,96.848 451.641,97.261 448.87,98.47 C423.368,109.584 397.783,120.516 372.809,132.793 C358.383,139.885 360.895,136.168 362.794,152.428 C363.673,159.953 366.651,167.39 364.424,175.195 C364.117,176.272 363.653,178.31 366.49,177.856 C366.99,177.776 367.69,182.441 367.134,182.508 C363.569,182.938 366.212,184.826 366.041,185.982 C365.499,189.653 368.95,191.659 369.735,194.886 C370.28,197.128 367.917,198.91 368.999,200.419 C372.454,205.235 372.317,210.189 370.334,215.241 C371.257,216.123 372.038,214.794 372.121,215.074 C376.989,231.654 374.418,249.202 378.948,266.054z`
      },
      {
        id: 'chest',
        label: 'Chest Area',
        path: `M676.25,359.277 C683.359,346.063 690.09,333.104 689.666,317.008 C692.641,319.762 692.204,322.486 691.871,325.124 C690.041,339.634 683.678,352.395 676.233,364.658 C671.712,372.104 666.701,379.252 661.581,387.034 C660.005,384.121 661.384,382.658 662.43,381.032 C667.009,373.908 671.527,366.745 676.25,359.277z`
      },
      {
        id: 'sleeve_left',
        label: 'Left Sleeve',
        path: `M681.713,164.776 C678.341,157.751 675.315,150.504 669.145,144.961 C661.093,201.324 648.506,256.821 647.444,313.822 C653.736,291.59 659.574,269.28 664.436,245.866 C666.664,248.194 665.858,249.789 665.574,251.316 C661.982,270.64 657.001,289.632 652.012,308.628 C649.549,318.002 644.883,327.114 648.448,337.317 C649.648,340.753 650.347,344.382 651.056,347.966 C652.671,356.136 655.542,364.045 656.982,372.176 C659.046,383.833 655.19,396.371 662.11,407.384 C662.272,407.643 662.237,408.032 662.273,408.362 C663.832,422.749 666.167,437.001 668.712,451.252 C670.07,458.853 673.763,466.34 671.526,474.504 C671.142,475.907 671.794,478.827 672.636,479.12 C676.348,480.411 675.604,483.693 676.081,486.109 C681.746,514.825 687.589,543.495 694.881,571.858 C695.876,575.729 697.539,577.02 701.38,576.787 C715.527,575.931 729.424,573.547 743.278,570.67 C747.833,569.725 749.239,567.63 748.687,563.135 C746.115,542.19 743.73,521.223 741.296,500.261 C738.747,478.306 736.161,456.356 733.699,434.391 C731.533,415.069 730.144,395.636 727.27,376.423 C723.856,353.595 719.297,330.936 715.096,308.229 C709.228,276.512 702.703,244.924 695.45,213.497 C691.712,197.298 688.381,180.95 681.713,164.776z`
      },
      {
        id: 'sleeve_right',
        label: 'Right Sleeve',
        path: `M376.883,321.659 C375.121,315.416 373.317,309.184 371.609,302.925 C369.946,296.827 368.279,290.725 366.801,284.58 C365.285,278.278 364.004,271.919 362.607,265.588 C361.27,259.529 359.423,253.534 360.143,247.183 C365.284,269.633 371.13,291.847 377.408,313.991 C377.805,257.484 363.515,202.823 356.556,147.251 C356.451,146.413 356.243,145.625 355.272,145.212 C353.385,145.536 352.902,147.329 352.04,148.655 C345.272,159.074 340.366,170.323 337.194,182.331 C327.253,219.973 319.36,258.071 312.124,296.302 C307.209,322.269 302.075,348.232 298.419,374.39 C294.185,404.681 291.565,435.196 288.055,465.592 C284.278,498.297 280.334,530.982 276.32,563.658 C275.781,568.05 277.266,569.874 281.533,570.796 C290.643,572.766 299.869,574.027 309.002,575.784 C317.847,577.486 326.728,575.574 335.534,576.871 C338.91,577.369 340.448,575.908 340.889,572.179 C343.642,548.918 346.684,525.691 349.63,502.453 C350.007,499.486 350.496,496.528 350.733,493.55 C350.95,490.811 352.35,488.131 351.202,484.414 C346.403,513.749 340.516,541.942 332.43,569.656 C331.337,567.289 332.1,565.122 332.648,562.944 C339.789,534.549 345.951,505.948 350.728,477.054 C351.105,474.771 351.039,471.742 352.451,470.435 C355.886,467.259 354.989,463.398 355.005,459.815 C355.02,456.438 355.323,453.18 356.089,449.938 C358.117,441.353 359.578,432.676 360.861,423.947 C362.077,415.671 361.33,406.891 366.696,399.539 C367.493,398.446 367.712,396.644 367.598,395.219 C366.295,378.967 371.058,363.596 374.154,347.961 C375.814,339.575 379.516,331.357 376.883,321.659z`
      }
    ]
  },
  'Kurta Sets': {
    viewBox: "0 0 1024 1024",
    zones: [
      {
        id: 'body',
        label: 'Body',
        path: `M630.079,447.652 C626.616,413.434 622.69,379.706 620.143,345.875 C619.188,333.183 613.142,321.916 612.491,309.362 C611.878,319.392 613.431,329.252 614.807,339.106 C617.978,361.816 622.024,384.401 624.389,407.228 C626.085,423.603 628.36,439.926 629.72,456.327 C631.355,476.048 633.688,495.702 634.481,515.515 C635.132,531.781 637.257,547.99 638.773,564.22 C640.598,583.765 642.447,603.308 644.327,622.848 C646.175,642.054 648.075,661.256 649.953,680.459 C651.977,701.153 653.971,721.849 656.049,742.537 C656.484,746.87 653.521,746.943 650.643,747.205 C643.921,747.815 643.508,747.84 644.231,754.432 C644.86,760.166 642.69,762.923 637.423,764.618 C631.878,766.402 626.438,768.532 620.726,769.734 C616.878,770.543 615.271,772.445 615.231,776.601 C614.966,804.593 614.483,832.582 614.027,860.572 C613.425,897.554 612.729,934.534 612.232,971.517 C612.174,975.847 610.701,978.367 606.54,979.628 C603.363,980.59 600.217,981.806 597.254,983.298 C577.886,993.051 558.898,987.804 540.07,981.701 C526.289,977.233 528.097,980.658 527.639,964.775 C526.552,927.149 525.212,889.531 524.017,851.908 C523.526,836.424 523.172,820.935 522.701,805.45 C522.499,798.793 522.052,792.142 521.925,785.485 C521.864,782.313 520.613,781.184 517.43,781.041 C503.999,780.434 503.782,780.329 502.711,793.607 C501.922,803.394 501.728,813.232 501.407,823.053 C500.627,846.858 499.892,870.666 499.206,894.475 C498.476,919.785 497.733,945.097 497.212,970.412 C497.106,975.578 495.581,978.544 490.218,980.125 C478.382,983.612 466.416,986.466 454.354,988.972 C451.724,989.519 449.089,989.393 446.434,988.725 C436.886,986.321 427.624,983.116 418.501,979.418 C414.358,977.738 412.79,975.152 412.767,970.682 C412.691,956.023 412.465,941.364 412.087,926.704 C411.292,895.891 411.37,865.055 410.562,834.242 C410.054,814.916 409.797,795.593 409.731,776.266 C409.718,772.601 408.391,770.91 404.862,770.029 C398.248,768.378 391.69,766.503 385.352,763.875 C381.973,762.474 380.132,760.591 380.664,756.779 C380.87,755.305 380.592,753.766 380.777,752.287 C381.227,748.691 379.931,747.279 376.128,747.167 C368.34,746.937 368.077,746.205 368.854,738.551 C371.241,715.056 373.467,691.544 375.784,668.042 C377.988,645.685 380.295,623.337 382.432,600.973 C384.285,581.595 385.663,562.168 387.788,542.822 C391.075,512.884 391.61,482.721 395.479,452.833 C396.587,444.273 396.959,435.617 396.922,426.915 C395.732,437.12 394.541,447.324 393.355,457.529 C392.299,466.612 391.219,475.693 390.216,484.782 C389.888,487.754 388.552,489.236 385.387,489.19 C367.874,488.941 350.467,487.731 333.299,483.997 C329.919,483.262 328.779,481.664 329.129,478.045 C331.466,453.872 333.435,429.665 335.79,405.494 C338.192,380.833 340.952,356.206 343.458,331.554 C345.897,307.567 348.414,283.592 351.662,259.698 C355.557,231.049 359.438,202.401 364.248,173.883 C366.825,158.608 369.431,143.379 375.296,128.92 C379.51,118.533 386.344,111.116 397.124,106.997 C417.345,99.27 437.317,90.892 457.461,82.961 C460.475,81.774 462.541,80.182 463.874,77.229 C465.996,72.524 468.56,68.017 470.639,63.295 C472.425,59.237 475.574,57.101 479.596,56.014 C500.307,50.418 521.064,50.907 541.881,55.49 C548.757,57.004 554.116,60.459 556.089,67.324 C559.27,78.385 566.975,83.523 577.38,87.226 C594.937,93.474 611.957,101.214 629.339,107.976 C638.576,111.571 644.256,118.331 648.104,126.959 C654.961,142.333 657.608,158.814 660.261,175.251 C663.697,196.536 667.058,217.836 670.121,239.177 C672.458,255.459 674.413,271.8 676.301,288.143 C678.666,308.623 680.859,329.123 682.994,349.629 C684.87,367.659 686.576,385.707 688.335,403.749 C690.175,422.622 692.008,441.496 693.801,460.373 C694.367,466.336 694.695,472.321 695.319,478.277 C695.706,481.967 694.337,483.693 690.614,484.339 C674.016,487.22 657.342,489.077 640.471,489.084 C636.679,489.086 634.68,487.908 634.266,483.799 C633.066,471.883 631.554,459.999 630.079,447.652z`
      },
      {
        id: 'collar',
        label: 'Collar/Neck',
        path: `M513.494,77.682 C524.853,77.583 536.075,78.903 547.201,81.068 C548.814,81.382 550.098,81.443 551.305,80.223 C554.553,76.938 557.385,73.385 556.641,68.412 C555.931,63.669 551.93,62.341 548.106,61.027 C546.536,60.487 544.922,60.035 543.295,59.711 C527.324,56.527 511.174,56.436 495.044,57.577 C487.623,58.101 480.113,59.043 473.073,61.844 C467.831,63.93 465.854,67.631 467.222,72.349 C469.072,78.73 472.683,81.504 478.226,80.43 C489.555,78.233 500.97,77.314 513.494,77.682z`
      },
      {
        id: 'chest',
        label: 'Chest',
        path: `M501.446,128.735 C503.279,129.179 505.133,130.559 506.98,128.637 C505.291,114.688 499.107,104.109 486.088,97.512 C476.854,92.833 468.27,86.875 464.551,76.283 C464.191,75.261 463.834,73.945 462.26,74.081 C460.857,74.203 460.416,75.3 459.948,76.394 C458.772,79.142 458.029,82.223 456.287,84.555 C449.867,93.153 453.75,99.937 459.63,106.499 C460.957,107.979 462.402,109.368 463.895,110.683 C474.507,120.027 486.965,125.591 501.446,128.735z`
      },
      {
        id: 'waist',
        label: 'Waist',
        path: `M522.537,81.114 C507.581,79.745 492.755,80.237 477.242,83.875 C483.581,90.708 491.408,93.952 497.998,98.864 C504.836,103.962 507.991,111.56 511.886,120.269 C516.232,106.019 525.051,97.879 536.486,92.076 C540.066,90.259 543.534,88.154 546.453,84.333 C538.379,82.096 530.965,81.423 522.537,81.114z`
      },
      {
        id: 'sleeve_left',
        label: 'Left Sleeve',
        path: `M560.527,78.062 C558.443,82.115 555.694,85.707 552,88.326 C545.77,92.743 539.463,97.078 532.949,101.058 C522.312,107.556 518.197,117.446 516.975,129.013 C518.67,130.103 520.02,129.748 521.266,129.441 C530.165,127.247 538.818,124.371 546.85,119.856 C556.426,114.472 564.742,107.758 569.922,97.787 C570.67,96.348 571.935,94.883 571.213,93.15 C568.4,86.404 565.465,79.709 562.38,72.541 C561.718,74.637 561.275,76.042 560.527,78.062z`
      },
      {
        id: 'sleeve_right',
        label: 'Right Sleeve',
        path: `M483.122,71.984 C502.432,67.876 521.754,68.47 541.025,72.121 C545.706,73.008 546.861,69.781 548.148,66.836 C549.599,63.515 546.75,62.498 544.468,61.536 C542.64,60.766 540.711,60.166 538.771,59.745 C526.492,57.083 514.03,56.709 501.583,57.624 C494.51,58.144 487.296,58.46 480.526,61.075 C478.132,62 475.554,63.085 476.411,66.317 C477.202,69.3 477.998,72.702 483.122,71.984z`
      }
    ]
  },
  Sherwani: {
    viewBox: "0 0 1024 1024",
    zones: [
      {
        id: 'body',
        label: 'Body',
        path: `M648.291,403.88 C649.642,424.606 650.642,444.861 653.03,465.038 C656.625,495.419 662.182,525.511 666.007,555.839 C669.896,586.675 673.704,617.531 676.474,648.504 C679.526,682.62 683.079,716.692 686.149,750.806 C688.445,776.318 690.3,801.869 692.388,827.4 C694.613,854.594 696.88,881.785 699.129,908.977 C699.499,913.453 699.701,917.952 700.298,922.398 C700.867,926.631 699.212,929.279 695.601,931.336 C661.587,950.712 625.69,964.708 586.745,970.45 C561.343,974.195 535.855,976.368 510.18,976.32 C507.723,976.315 505.316,976.558 503.36,974.208 C501.853,972.397 499.289,973.191 497.172,973.126 C477.032,972.507 456.891,971.816 436.893,969.163 C405.769,965.034 376.101,956.117 348.109,941.772 C341.139,938.2 334.154,934.674 327.502,930.516 C324.438,928.601 323.078,926.525 323.452,922.419 C325.807,896.586 327.722,870.712 329.8,844.853 C332.13,815.849 334.211,786.822 336.898,757.85 C339.417,730.707 341.645,703.537 344.431,676.413 C346.944,651.941 348.965,627.412 351.727,602.962 C355.405,570.42 359.972,538.008 365.261,505.682 C368.694,484.699 371.269,463.577 372.809,442.334 C374.157,423.736 376.251,405.145 375.61,386.502 C375.199,374.543 376.659,362.553 374.877,350.639 C374.637,349.034 374.244,347.452 373.564,345.876 C373.098,349.934 370.397,353.598 372.933,358.147 C373.996,360.054 372.393,363.584 371.479,365.602 C367.574,374.218 367.696,383.439 366.497,392.404 C363.697,413.332 361.266,434.314 359.057,455.314 C357.185,473.118 354.056,490.885 356.223,508.915 C356.303,509.573 356.653,510.476 356.355,510.861 C350.224,518.768 352.425,528.342 351.631,537.093 C349.784,557.468 349.043,577.951 348.177,598.403 C347.967,603.361 346.496,605.995 341.336,606.895 C320.93,610.457 300.48,612.957 279.761,610.355 C272.425,609.434 269.67,604.027 270.198,596.823 C270.557,591.916 270.968,586.778 270.27,581.788 C269.931,579.367 270.167,577.023 272.452,576.292 C275.639,575.272 275.697,573.168 275.832,570.554 C277.444,539.471 279.092,508.39 280.804,477.313 C282.076,454.22 283.066,431.101 284.902,408.052 C286.566,387.177 288.005,366.164 291.707,345.601 C296.735,317.673 300.246,289.477 307.066,261.815 C310.539,247.735 311.414,232.927 313.631,218.469 C317.165,195.422 321.514,172.608 329.624,150.633 C333.147,141.085 338.749,134.531 348.632,130.397 C378.451,117.923 408.628,106.381 438.757,94.721 C446.562,91.701 451.844,87.369 454.219,79.369 C455.019,76.672 456.795,74.237 457.417,71.521 C459.962,60.405 467.972,55.723 478.145,54.066 C501.497,50.262 524.868,50.252 548.151,54.84 C557.211,56.625 563.884,61.333 566.055,70.748 C569.389,85.205 578.111,93.441 592.465,97.807 C609.47,102.98 625.717,110.528 642.422,116.729 C655.979,121.762 669.095,128.002 682.309,133.925 C686.973,136.016 689.288,140.426 691.301,144.897 C698.807,161.564 702.928,179.203 706.261,197.066 C710.224,218.3 712.059,239.954 716.604,260.99 C723.562,293.191 727.902,325.764 733.439,358.165 C736.977,378.872 738.147,399.775 739.365,420.689 C740.894,446.939 742.56,473.181 744.004,499.435 C744.928,516.226 745.545,533.034 746.33,549.833 C746.648,556.651 747.014,563.468 747.429,570.28 C747.581,572.791 747.863,575.219 750.784,576.396 C751.707,576.767 752.966,578.27 752.821,579.01 C751.842,584.006 755.873,588.973 752.824,593.926 C752.168,594.991 752.411,596.08 752.813,597.266 C754.951,603.569 752.091,609.039 745.639,609.889 C723.78,612.77 702.134,611.648 680.799,605.741 C677.55,604.841 676.149,602.955 675.962,599.716 C675.272,587.75 674.413,575.793 673.785,563.824 C672.485,539.066 670.147,514.395 668.012,489.701 C665.562,461.371 661.707,433.21 658.561,404.965 C656.888,389.949 655.425,374.891 652.602,360.014 C651.874,356.175 652.304,352.123 650.05,348.416 C646.874,366.655 647.922,385.039 648.291,403.88z`
      },
      {
        id: 'collar',
        label: 'Collar/Neck',
        path: `M567.624,259.607 C567.633,257.844 567.651,256.514 567.635,255.183 C567.555,248.394 567.546,248.315 574.348,247.73 C576.61,247.536 578.133,246.746 578.879,244.57 C580.339,240.308 583.329,237.233 586.742,234.485 C593.217,229.27 599.633,223.979 606.169,218.842 C611.175,214.907 612.992,215.219 616.532,220.633 C620.446,226.621 624.22,232.741 626.526,239.547 C627.682,242.959 629.529,244.449 633.074,244.131 C637.402,243.743 638.782,245.856 637.812,249.927 C637.507,251.209 637.391,252.561 637.38,253.883 C637.306,263.463 637.991,262.172 629.086,262.916 C610.715,264.452 592.285,265.313 573.871,266.284 C567.564,266.616 567.552,266.386 567.624,259.607z`
      },
      {
        id: 'chest',
        label: 'Chest',
        path: `M604.633,261.81 C611.6,261.435 618.564,261.002 625.533,260.7 C634.181,260.325 634.123,260.274 635.301,251.89 C635.801,248.335 634.977,247.06 631.22,247.301 C618.469,248.118 605.702,248.673 592.943,249.361 C587.14,249.674 581.333,249.969 575.543,250.447 C570.665,250.85 570.258,252.135 570.279,259.557 C570.291,264.006 572.896,263.862 575.847,263.678 C585.128,263.098 594.406,262.474 604.633,261.81z`
      },
      {
        id: 'waist',
        label: 'Waist Band',
        path: `M604.917,226.448 C597.625,232.873 588.248,237.156 582.969,247.209 C596.821,245.91 609.717,246.572 622.74,244.376 C620.967,237.832 618.139,232.775 615.195,227.777 C611.338,221.227 611.322,221.237 604.917,226.448z`
      },
      {
        id: 'sleeve_left',
        label: 'Left Sleeve',
        path: `M519.527,215.491 C520.961,219.056 524.98,218.229 527.785,221.416 C522.703,221.626 520.969,225.305 518.222,227.906 C515.075,230.886 511.129,230.395 507.707,227.752 C504.389,225.19 503.35,220.521 505.407,216.969 C507.54,213.286 510.778,211.608 515.096,212.635 C516.754,213.029 518.177,213.88 519.527,215.491z`
      },
      {
        id: 'sleeve_right',
        label: 'Right Sleeve',
        path: `M512.047,165.541 C506.614,165.183 504.416,161.807 503.792,157.397 C503.236,153.465 505.441,150.627 509.018,149.269 C513.18,147.689 517.13,148.579 519.503,152.448 C521.199,155.215 524.017,155.211 526.695,156.843 C520.267,157.345 519.455,166.215 512.047,165.541z`
      }
    ]
  }
};

// Embroidery patterns
const EMBROIDERY_PATTERNS = {
  maggam: {
    name: 'Maggam Work',
    note: 'Heavy embellishment',
    density: 'heavy',
    threadColors: ['#d4af37', '#ec4899', '#10b981'],
    createPattern: (color = '#ec4899') => {
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(35, 35, 10, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x = 35 + Math.cos(angle) * 20;
        const y = 35 + Math.sin(angle) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(35, 35);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      return canvas;
    }
  },
  threadWork: {
    name: 'Thread Work',
    note: 'Delicate embroidery',
    density: 'light',
    threadColors: ['#8b5cf6', '#ec4899', '#f59e0b'],
    createPattern: (color = '#8b5cf6') => {
      const canvas = document.createElement('canvas');
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext('2d');

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(30, 30, 10 + i * 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        ctx.beginPath();
        ctx.moveTo(30, 30);
        ctx.lineTo(30 + Math.cos(angle) * 25, 30 + Math.sin(angle) * 25);
        ctx.stroke();
      }

      return canvas;
    }
  }
};

const FABRIC_PRINTS = {
  block: {
    img: assets.block_img,
    name: 'Block Pattern',
    description: 'Traditional block stamp pattern',
    createPattern: (color = '#8B0000') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');

      ctx.fillStyle = color;
      for (let x = 10; x < 120; x += 40) {
        for (let y = 10; y < 120; y += 40) {
          ctx.fillRect(x, y, 22, 22);
        }
      }

      return c;
    }
  },
  bagru: {
    img: assets.bagru_img,
    name: 'Bagru Pattern',
    description: 'Rajasthani Bagru hand-block print',
    createPattern: (color = '#5C4033') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');

      ctx.fillStyle = color;
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      return c;
    }
  },
  floral: {
    img: assets.floral_img,
    name: 'Floral Pattern',
    description: 'Soft floral motifs',
    createPattern: (color = '#E91E63') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');

      const drawFlower = (x, y) => {
        ctx.fillStyle = color;
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * 12, y + Math.sin(a) * 12, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      };

      for (let x = 20; x < 120; x += 40) {
        for (let y = 20; y < 120; y += 40) {
          drawFlower(x, y);
        }
      }

      return c;
    }
  },
  kalamkari: {
    img: assets.kalamkari_img,
    name: 'Kalamkari Pattern',
    description: 'Hand-painted kalamkari art',
    createPattern: (color = '#3B2F2F') => {
      const c = document.createElement('canvas');
      c.width = c.height = 140;
      const ctx = c.getContext('2d');

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(10, 70);
      for (let x = 10; x < 130; x += 20) {
        ctx.quadraticCurveTo(x + 10, 50 + Math.random() * 40, x + 20, 70);
      }
      ctx.stroke();

      return c;
    }
  },
  shibori: {
    img: assets.shibori_img,
    name: 'Shibori Pattern',
    description: 'Indigo resist-dye pattern',
    createPattern: (color = '#1E3A8A') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

      for (let i = 0; i < 6; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        ctx.beginPath();
        ctx.arc(x, y, 15 + Math.random() * 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      return c;
    }
  },
  painting: {
    img: assets.painting_img,
    name: 'Painting Pattern',
    description: 'Abstract modern painting',
    createPattern: (color = '#4F46E5') => {
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const ctx = c.getContext('2d');

      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 120, Math.random() * 120);
        ctx.lineTo(Math.random() * 120, Math.random() * 120);
        ctx.stroke();
      }

      return c;
    }
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DesignCanvas = ({
  onDesignChange,
  dressType = 'Kurta',
  selectedColor = '#ffffff',
  gender = 'Women',
  aiPrompt = '',
  onAIPromptChange,
  onAIGenerate,
  aiGenerating = false
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneColors, setZoneColors] = useState({});
  const [zonePatterns, setZonePatterns] = useState({});
  const [activeTab, setActiveTab] = useState('styles');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const [embroideryMetadata, setEmbroideryMetadata] = useState({});
  const [neckStyle, setNeckStyle] = useState('round');
  const [sleeveStyle, setSleeveStyle] = useState('full');
  const [initialized, setInitialized] = useState(false); // ✅ FIX: Add flag to prevent infinite loop

  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get template
  const template = SVG_TEMPLATES[dressType] || SVG_TEMPLATES.Kurta;

  // ✅ FIX 1: Sync selectedColor prop with local currentColor state
  useEffect(() => {
    setCurrentColor(selectedColor);
  }, [selectedColor]);

  // ✅ FIX 2: Initialize all zones with base color ONCE on mount or when dress type changes
  useEffect(() => {
    if (!initialized) {
      const initialColors = {};
      template.zones.forEach(zone => {
        initialColors[zone.id] = selectedColor;
      });
      setZoneColors(initialColors);
      setInitialized(true); // Mark as initialized
    }
  }, [initialized]); // Only depend on initialized flag

  // Reset initialization when dress type changes
  useEffect(() => {
    setInitialized(false);
  }, [dressType]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Sleeve visibility logic - now supports full/elbow/short/sleeveless
  const getSleeveVisibility = (zoneId) => {
    if (!zoneId.includes('sleeve')) return { visible: true, clipPath: null };

    switch (sleeveStyle) {
      case 'full':
        return { visible: true, clipPath: null };
      case 'elbow':
        // Show 75% of sleeve (3/4th length)
        return { visible: true, clipPath: 'inset(0 0 25% 0)' };
      case 'short':
        // Show 50% of sleeve
        return { visible: true, clipPath: 'inset(0 0 50% 0)' };
      case 'sleeveless':
        return { visible: false, clipPath: null };
      default:
        return { visible: true, clipPath: null };
    }
  };

  // Save to history
  const saveToHistory = useCallback(() => {
    const state = {
      zoneColors: { ...zoneColors },
      zonePatterns: { ...zonePatterns },
      embroideryMetadata: { ...embroideryMetadata },
      currentColor,
      neckStyle,
      sleeveStyle
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [zoneColors, zonePatterns, embroideryMetadata, currentColor, neckStyle, sleeveStyle, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setNeckStyle(state.neckStyle);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];

      setZoneColors(state.zoneColors);
      setZonePatterns(state.zonePatterns);
      setEmbroideryMetadata(state.embroideryMetadata);
      setCurrentColor(state.currentColor);
      setNeckStyle(state.neckStyle);
      setSleeveStyle(state.sleeveStyle);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  // Get available necklines based on gender
  const getAvailableNecklines = () => {
    if (gender === 'Men') {
      return [
        { value: 'collar', label: 'Collar Neck' },
        { value: 'round', label: 'Round Neck' },
        { value: 'vNeck', label: 'V Neck' }
      ];
    }
    return [
      { value: 'round', label: 'Round Neck' },
      { value: 'square', label: 'Square Neck' },
      { value: 'vNeck', label: 'V Neck' },
      { value: 'boat', label: 'Boat Neck' },
      { value: 'sweetheart', label: 'Sweetheart' },
      { value: 'halter', label: 'Halter Neck' }
    ];
  };

  const sleeveOptions = [
    { value: 'full', label: 'Full Sleeve' },
    { value: 'elbow', label: '3/4 (Elbow)' },
    { value: 'short', label: 'Short Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' }
  ];

  // Handle zone click
  const handleZoneClick = (zoneId) => {
    setSelectedZone(zoneId);
  };

  // Get zone color
  const getZoneColor = (zoneId) => {
    return zoneColors[zoneId] || currentColor;
  };

  // Apply embroidery to zone
  const applyEmbroidery = (patternKey) => {
    if (!selectedZone) return;

    const pattern = EMBROIDERY_PATTERNS[patternKey];
    if (!pattern) return;

    const metadata = {
      type: patternKey,
      zone: selectedZone,
      zoneName: template.zones.find(z => z.id === selectedZone)?.label,
      density: pattern.density,
      threadColor: pattern.threadColors[0],
      appliedAt: new Date().toISOString()
    };

    setEmbroideryMetadata(prev => ({
      ...prev,
      [selectedZone]: metadata
    }));

    const patternCanvas = pattern.createPattern(pattern.threadColors[0]);
    const patternUrl = patternCanvas.toDataURL();

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: { type: 'embroidery', url: patternUrl }
    }));

    saveToHistory();
    if (isMobile) setSidebarOpen(false);
  };

  // Apply fabric print to zone
  const applyFabricPrint = (printKey) => {
    if (!selectedZone) return;

    const print = FABRIC_PRINTS[printKey];
    if (!print) return;

    const patternCanvas = print.createPattern();
    const patternUrl = patternCanvas.toDataURL();

    setZonePatterns(prev => ({
      ...prev,
      [selectedZone]: { type: 'print', url: patternUrl }
    }));

    saveToHistory();
    if (isMobile) setSidebarOpen(false);
  };

  // Clear zone
  const clearZone = () => {
    if (!selectedZone) return;

    setZoneColors(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    setZonePatterns(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    setEmbroideryMetadata(prev => {
      const updated = { ...prev };
      delete updated[selectedZone];
      return updated;
    });

    saveToHistory();
  };

  // Apply color to zone
  const applyColorToZone = (color) => {
    if (!selectedZone) return;

    setZoneColors(prev => ({
      ...prev,
      [selectedZone]: color
    }));

    saveToHistory();
  };

  // Export design
  useEffect(() => {
    if (onDesignChange && svgRef.current) {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);

      onDesignChange({
        svg: svgString,
        zoneColors,
        zonePatterns,
        neckStyle,
        sleeveStyle,
        color: currentColor,
        baseColor: currentColor,
        embroideryMetadata: Object.values(embroideryMetadata)
      });
    }
  }, [zoneColors, zonePatterns, currentColor, neckStyle, sleeveStyle, embroideryMetadata, onDesignChange]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Get description for sleeve style
  const getSleeveDescription = () => {
    switch (sleeveStyle) {
      case 'full':
        return 'Full length sleeves';
      case 'elbow':
        return '3/4 length (elbow) sleeves';
      case 'short':
        return 'Short sleeves';
      case 'sleeveless':
        return 'No sleeves';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        {/* Canvas Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Design Canvas</h3>
                <p className="text-xs sm:text-sm text-gray-500">{dressType} • {getSleeveDescription()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Undo"
              >
                <Undo size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Redo"
              >
                <Redo size={18} />
              </button>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 sm:p-3 bg-pink-500 text-white rounded-lg">
                  <Menu size={18} />
                </button>
              )}
            </div>
          </div>

          {/* SVG Canvas */}
          <div ref={containerRef} className="flex justify-center bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-8">
            <svg
              ref={svgRef}
              viewBox={template.viewBox}
              className="w-full max-w-md border-4 border-white rounded-xl shadow-2xl"
              style={{ maxHeight: '600px' }}
            >
              <defs>
                {Object.entries(zonePatterns).map(([zoneId, pattern]) => (
                  <pattern
                    key={zoneId}
                    id={`pattern-${zoneId}`}
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                  >
                    <image href={pattern.url} width="100" height="100" />
                  </pattern>
                ))}

                {/* Clip paths for sleeve lengths */}
                <clipPath id="elbow-clip">
                  <rect x="0" y="0" width="100%" height="75%" />
                </clipPath>
                <clipPath id="short-clip">
                  <rect x="0" y="0" width="100%" height="50%" />
                </clipPath>
              </defs>

              {template.zones.map((zone) => {
                const sleeveVis = getSleeveVisibility(zone.id);

                return sleeveVis.visible && (
                  <path
                    key={zone.id}
                    d={zone.path}
                    fill={zonePatterns[zone.id] ? `url(#pattern-${zone.id})` : getZoneColor(zone.id)}
                    stroke={selectedZone === zone.id ? '#ec4899' : 'rgba(0,0,0,0.1)'}
                    strokeWidth={selectedZone === zone.id ? 3 : 1}
                    onClick={() => handleZoneClick(zone.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: selectedZone === zone.id ? 0.9 : 1,
                      clipPath: sleeveVis.clipPath || 'none'
                    }}
                    className="hover:opacity-80"
                  />
                );
              })}
            </svg>
          </div>

          {/* Zone Selection */}
          <div className="mt-4 sm:mt-6">
            <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-2 sm:mb-3 uppercase">Select Area to Customize</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {template.zones.filter(zone => getSleeveVisibility(zone.id).visible).map(zone => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-xs font-semibold ${selectedZone === zone.id
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-gray-200 hover:border-pink-300'
                    }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 size={20} className="text-pink-500" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  Editing: {template.zones.find(z => z.id === selectedZone)?.label}
                </span>
              </div>
              <button
                onClick={clearZone}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            </div>
          )}

          {Object.keys(embroideryMetadata).length > 0 && (
            <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-sm text-amber-900 mb-2">Applied Embroidery</h4>
              {Object.entries(embroideryMetadata).map(([zoneId, data]) => (
                <div key={zoneId} className="text-xs text-amber-800 mb-1">
                  • {data.zoneName}: {EMBROIDERY_PATTERNS[data.type].name}
                </div>
              ))}
            </div>
          )}

          {sleeveStyle !== 'full' && (
            <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-800 font-semibold flex items-center gap-2">
                <Info size={14} />
                {getSleeveDescription()} applied
              </p>
            </div>
          )}
        </div>

        {/* Tools Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300' : 'relative'}
          ${isMobile && !sidebarOpen ? 'translate-y-full' : 'translate-y-0'}
          bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-gray-200 
          ${isMobile ? 'max-h-[80vh] overflow-y-auto' : 'p-6 space-y-6'}
        `}>
          {isMobile && (
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <Settings className="text-pink-500" size={20} />
                <h3 className="text-lg font-bold">Design Tools</h3>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-3 pb-5 border-b">
              <Settings className="text-pink-500" size={24} />
              <h3 className="text-xl font-bold">Design Tools</h3>
            </div>
          )}

          <div className={isMobile ? 'p-4 space-y-6' : 'space-y-6'}>
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl text-xs">
              {['styles', 'embroidery', 'prints'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2.5 rounded-lg font-bold transition-all capitalize ${activeTab === tab ? 'bg-pink-500 text-white' : 'text-gray-600'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'styles' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3 flex items-center gap-2">
                    <Palette size={14} className="text-pink-500" />
                    Base Color
                  </h4>
                  <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 border-2 border-pink-100">
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => {
                          const color = e.target.value;
                          setCurrentColor(color);

                          if (selectedZone) {
                            setZoneColors(prev => ({
                              ...prev,
                              [selectedZone]: color
                            }));
                          }

                          saveToHistory();
                        }}
                        className="w-20 h-20 rounded-xl cursor-pointer border-2 border-white shadow-lg"
                      />
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hex Code</label>
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            const color = e.target.value;
                            setCurrentColor(color);

                            if (selectedZone) {
                              setZoneColors(prev => ({
                                ...prev,
                                [selectedZone]: color
                              }));
                            }

                            saveToHistory();
                          }}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>

                    {selectedZone && (
                      <button
                        onClick={() => applyColorToZone(currentColor)}
                        className="w-full mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all font-semibold text-sm"
                      >
                        Apply to {template.zones.find(z => z.id === selectedZone)?.label}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Neckline Style</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getAvailableNecklines().map(style => (
                      <button
                        key={style.value}
                        onClick={() => {
                          setNeckStyle(style.value);
                          saveToHistory();
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${neckStyle === style.value ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                          }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-3">Sleeve Length</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sleeveOptions.map(style => (
                      <button
                        key={style.value}
                        onClick={() => {
                          setSleeveStyle(style.value);
                          if (style.value === 'sleeveless' && selectedZone && selectedZone.includes('sleeve')) {
                            setSelectedZone(null);
                          }
                          saveToHistory();
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${sleeveStyle === style.value ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                          }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'embroidery' && (
              <div className="space-y-4">
                {selectedZone ? (
                  <>
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                      <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                        <Info size={14} />
                        Select embroidery style for the selected zone
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(EMBROIDERY_PATTERNS).map(([key, config]) => {
                        const patternCanvas = config.createPattern();
                        return (
                          <button
                            key={key}
                            onClick={() => applyEmbroidery(key)}
                            className="group p-4 rounded-xl border-2 border-gray-200 hover:border-pink-500 hover:shadow-lg transition-all flex items-center gap-4"
                          >
                            <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-white shadow-inner">
                              <img src={patternCanvas.toDataURL()} alt={config.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-sm font-semibold text-gray-800 mb-1">{config.name}</div>
                              <div className="text-xs text-gray-500">{config.note}</div>
                            </div>
                            <CheckCircle2 size={20} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Move size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-sm text-gray-500">Select a zone first</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prints' && (
              <div className="space-y-4">
                {selectedZone ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(FABRIC_PRINTS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => applyFabricPrint(key)}
                        className="group p-4 rounded-xl border-2 border-gray-200 hover:border-pink-500 hover:shadow-lg transition-all flex items-center gap-4"
                      >
                        {/* ✅ USE STATIC IMAGE PREVIEW */}
                        <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-white shadow-inner">
                          <img
                            src={config.img}
                            alt={config.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-left flex-1">
                          <div className="text-sm font-semibold text-gray-800">
                            {config.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {config.description}
                          </div>
                        </div>

                        <CheckCircle2
                          size={20}
                          className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500">Select a zone first</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;