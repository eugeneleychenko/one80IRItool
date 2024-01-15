import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Sidebar = styled(Box)({
  width: "300px",
  marginRight: "20px",
});

const CreativeContainer = styled(Box)({
  flex: 1,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});

const AdContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
});

const IriArea = styled(Box)({
  position: "absolute",
  overflow: "hidden",
  whiteSpace: "nowrap",
  fontFamily: "'Montserrat', sans-serif",
});

function Ad() {
  const [creative, setCreative] = useState(null);
  const [iriArea, setIriArea] = useState({ x: 0, y: 0, height: 0, width: 0 });
  const [iriText, setIriText] = useState("");
  const [clickTag, setClickTag] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [adSize, setAdSize] = useState({ width: 300, height: 250 }); // default ad size
  // Add a new state to track the overlay visibility
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // This function will be called when the Escape key is pressed
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSelecting(false);
        setShowOverlay(false);
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // The cleanup function: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // The empty array means this effect runs once on mount and cleanup on unmount

  const Overlay = styled(Box)(({ show }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0)", // Transparent background
    cursor: show ? "crosshair" : "default", // Change cursor based on showOverlay state
  }));

  const handleCreativeUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setCreative({
        src: e.target.result,
        width: adSize.width,
        height: adSize.height,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top; // y position within the element.
    setStartPoint({ x, y });
    setIsSelecting(true);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove); // Add this line
  };

  const handleMouseMove = (event) => {
    if (isSelecting) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setIriArea({
        x: Math.min(x, startPoint.x),
        y: Math.min(y, startPoint.y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y),
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsSelecting(false);
      setShowOverlay(false);
    }
  };
  const handleMouseUp = () => {
    setIsSelecting(false);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove); // Add this line
  };

  const handleIriTextUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setIriText(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const zip = new JSZip();
    zip.file(
      "index.html",
      `<html>
<head>
  <meta name="ad.size" content="width=${adSize.width},height=${adSize.height}">
  <script type="text/javascript">
    var clickTag = "${clickTag}";
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div style="position: absolute; width: ${adSize.width}px; height: ${
        adSize.height
      }px;">
    <img src="bg.png" alt="Creative" style="position: absolute; width: 100%; height: 100%;">
    <div id="scrollingTextContainer" style="font-family: 'Montserrat', sans-serif; position: absolute; top: ${
      iriArea.y - 272
    }px; left: ${iriArea.x - 315}px; height: ${iriArea.height - 5}px; width: ${
        iriArea.width
      }px; overflow: hidden; z-index: 10000">
      <div id="scrollingText" style="position: absolute; white-space: pre-wrap;">${iriText}</div>
    </div>
    <a href="javascript:void(window.open(clickTag))" style="position: absolute; width: ${
      iriArea.x
    }px; height: 100%; top: 0; left: 0; z-index: 0;"></a>

  
  </div>
  <script>
  document.addEventListener("DOMContentLoaded", function() {
    var scrollingText = document.getElementById("scrollingText");
    var scrollAmount = 0;
    var scrollSpeed = 0.2;
    var scrollInterval = setInterval(function() {
      scrollAmount += scrollSpeed;
      scrollingText.style.transform = "translateY(-" + scrollAmount + "px)";
      if (scrollAmount >= scrollingText.scrollHeight) {
        scrollAmount = 0;
      }
    }, 50);
  
    var scrollingTextContainer = document.getElementById("scrollingTextContainer");
    scrollingTextContainer.style.overflowY = "hidden";
  
    scrollingTextContainer.addEventListener("mouseenter", function() {
      clearInterval(scrollInterval);
      scrollingTextContainer.style.overflowY = "scroll";
    });
  
    scrollingTextContainer.addEventListener("mouseleave", function() {
      scrollingTextContainer.style.overflowY = "hidden";
      scrollInterval = setInterval(function() {
        scrollAmount += scrollSpeed;
        scrollingText.style.transform = "translateY(-" + scrollAmount + "px)";
        if (scrollAmount >= scrollingText.scrollHeight) {
          scrollAmount = 0;
        }
      }, 50);
    });
  });
  </script>
</body>
</html>`
    );
    zip.file("bg.png", creative.src.split(",")[1], { base64: true });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "ad.zip");
    });
  };

  return (
    <AdContainer style={{ marginLeft: "10px" }}>
      <Sidebar>
        <TextField
          select
          label="Ad Size"
          value={JSON.stringify(adSize)}
          onChange={(e) => setAdSize(JSON.parse(e.target.value))}
          helperText="Please select the ad size"
          variant="outlined"
          fullWidth
          margin="normal"
        >
          <MenuItem value='{"width":160,"height":600}'>160x600</MenuItem>
          <MenuItem value='{"width":300,"height":250}'>300x250</MenuItem>
          <MenuItem value='{"width":300,"height":600}'>300x600</MenuItem>
          <MenuItem value='{"width":728,"height":90}'>728x90</MenuItem>
          <MenuItem value='{"width":320,"height":50}'>320x50</MenuItem>
          <MenuItem value='{"width":320,"height":100}'>320x100</MenuItem>
        </TextField>
        <TextField
          label="Click Tag URL"
          value={clickTag}
          onChange={(e) => setClickTag(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" component="label" sx={{ margin: 1 }}>
          Upload Creative
          <input type="file" hidden onChange={handleCreativeUpload} />
        </Button>
        <Button
          variant="contained"
          sx={{ margin: 1 }}
          onClick={() => {
            setShowOverlay(!showOverlay); // Toggle the overlay visibility
            if (isSelecting) {
              setIsSelecting(false); // Ensure selection is turned off when toggling the overlay
            }
          }}
        >
          {showOverlay ? "Hit Escape When Done" : "Select IRI Area"}
        </Button>
        <TextField
          label="IRI Text"
          value={iriText}
          onChange={(e) => setIriText(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button variant="contained" onClick={handleExport} sx={{ margin: 1 }}>
          Export
        </Button>
        <Box sx={{ marginTop: 2, padding: 1, border: "1px solid grey" }}>
          <Typography variant="h6">IRI Area Details:</Typography>
          <Typography variant="body1">X: {iriArea.x}px</Typography>
          <Typography variant="body1">Y: {iriArea.y}px</Typography>
          <Typography variant="body1">Width: {iriArea.width}px</Typography>
          <Typography variant="body1">Height: {iriArea.height}px</Typography>
        </Box>
      </Sidebar>
      <CreativeContainer>
        {creative && (
          <>
            <img
              src={creative.src}
              alt="Creative"
              width={adSize.width}
              height={adSize.height}
              style={{
                display: "block",
                marginLeft: "0",
                marginRight: "auto",
              }}
            />
            {showOverlay && (
              <Overlay
                show={showOverlay}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsSelecting(false)}
              />
            )}
          </>
        )}
        <IriArea
          style={{
            top: iriArea.y,
            left: iriArea.x,
            width: iriArea.width,
            height: iriArea.height,
            border: isSelecting ? "1px dashed #000" : "none",
            overflow: "auto", // allow text to wrap within the area
            whiteSpace: "pre-wrap",
          }}
          dangerouslySetInnerHTML={{ __html: iriText }}
        />
      </CreativeContainer>
    </AdContainer>
  );
}

export default Ad;
