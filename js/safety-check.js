// Safety Check interaction for MÈO portal
document.addEventListener('DOMContentLoaded', () => {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const redirectMessage = document.getElementById('redirect-message');
    const countdownNum = document.getElementById('countdown-num');

    if (btnYes) {
        btnYes.addEventListener('click', () => {
            // Show hotline redirection banner
            if (redirectMessage) {
                redirectMessage.classList.remove('hidden');
                redirectMessage.classList.add('fade-in');
            }

            // Disable buttons and style selection
            if (btnNo) btnNo.style.display = 'none';
            btnYes.classList.add('opacity-75', 'cursor-not-allowed');
            btnYes.style.pointerEvents = 'none';
            btnYes.classList.remove('bg-emergency-red', 'hover:bg-opacity-90');
            btnYes.classList.add('bg-surface-variant', 'text-on-surface-variant', 'border-none');

            // 3-second countdown and redirect in a new tab
            let count = 3;
            if (countdownNum) countdownNum.textContent = count;

            const timer = setInterval(() => {
                count--;
                if (countdownNum) countdownNum.textContent = count;

                if (count <= 0) {
                    clearInterval(timer);
                    // Open duongdaynongngaymai.vn in a new tab
                    window.open('https://duongdaynongngaymai.vn/', '_blank');
                }
            }, 1000);
        });
    }

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            // Disable buttons and show loading feedback before redirecting to trang-chu.html
            if (btnYes) btnYes.style.display = 'none';
            btnNo.classList.add('opacity-75', 'cursor-not-allowed', 'bg-surface-variant', 'text-on-surface-variant', 'border-none');
            btnNo.style.pointerEvents = 'none';

            // Redirect to trang-chu.html after 400ms transition
            setTimeout(() => {
                window.location.href = 'trang-chu.html';
            }, 400);
        });
    }
});
