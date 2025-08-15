const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('Testing /test-working at 1920x1080...');
    await page.goto('http://localhost:3000/test-working');
    await page.waitForTimeout(4000); // Wait for full rendering
    
    // Take screenshot of current state
    await page.screenshot({ 
      path: 'test-working-final.png', 
      fullPage: false 
    });
    
    // Check if elements are overflowing
    const overflowData = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { error: 'No canvas found' };
      
      const canvasRect = canvas.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      return {
        canvasWidth: canvasRect.width,
        canvasHeight: canvasRect.height,
        canvasTop: canvasRect.top,
        canvasLeft: canvasRect.left,
        windowWidth,
        windowHeight,
        isOverflowing: canvasRect.bottom > windowHeight || canvasRect.right > windowWidth,
        actualBottom: canvasRect.bottom,
        actualRight: canvasRect.right
      };
    });
    
    console.log('Canvas positioning data:', overflowData);
    
    // Compare with original page
    console.log('Testing / (original) at 1920x1080...');
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(4000);
    
    await page.screenshot({ 
      path: 'original-current.png', 
      fullPage: false 
    });
    
    console.log('Screenshots saved: test-working-current.png and original-current.png');
    console.log('Canvas overflow check completed');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
