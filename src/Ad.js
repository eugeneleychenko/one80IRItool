import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createGlobalStyle } from "styled-components";

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
  justifyContent: "space-between", // This will push the sidebar to the right
});
const GlobalStyle = createGlobalStyle`
  p {
    margin-block-start: 0em;
    margin-block-end: 0em;
  }
`;
function Ad() {
  const [creative, setCreative] = useState(null);
  const [iriArea, setIriArea] = useState({ x: 0, y: 0, height: 0, width: 0 });
  const [iriText, setIriText] = useState("");
  const [clickTag, setClickTag] = useState("http://www.slynd.com");
  const [fullPrescribingInfoLink, setFullPrescribingInfoLink] = useState(
    "https://slynd.com/wp-content/uploads/2023/12/prescribing-information.pdf#page=15"
  ); // Add this line
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [adSize, setAdSize] = useState({ width: 300, height: 250 }); // default ad size
  // Add a new state to track the overlay visibility
  const [showOverlay, setShowOverlay] = useState(false);
  const [fontSize, setFontSize] = useState("10px");
  const [textAlign, setTextAlign] = useState("left");
  const [isIri, setIsIri] = useState(true); // New state for IRI/ISI switch
  const FullPrescribingInfoLink = ({ top, left }) => (
    <a
      href={fullPrescribingInfoLink}
      style={{
        textDecoration: "underline",
        cursor: "pointer",
        color: "blue",
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10001,
        fontSize: fontSize, // Use the same font size as the ir i
        fontFamily: "Helvetica, Arial, sans-serif", // Use the same font family as the iri
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isIri
        ? "IRI Full Prescribing Information"
        : "ISI Full Prescribing Information"}
    </a>
  );
  const IriArea = styled(Box)({
    position: "absolute",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontFamily: "Helvetica, sans-serif",
    fontSize: fontSize,
    textAlign: textAlign,
  });
  Ad.formats = ["size", "bold", "list", "bullet", "indent"];
  // Include any additional modules for toolbar functionality
  Ad.modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: ["Helvetica Neue"] }],
      [{ size: ["6px", "7px", "8px", "10px", "12px", "14px", "18px", "24px"] }],
      ["bold", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };
  const quillRef = React.useRef(null);
  useEffect(() => {
    console.log(iriText);
  }, [iriText]);
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
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCreative({
        src: e.target.result,
        width: adSize.width,
        height: adSize.height,
      });
    };
    reader.onerror = (e) => {
      console.error("Error reading file: ", e.target.error);
    };
    reader.readAsDataURL(file);
  };
  const handleMouseDown = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top; // y position within the element.
    setStartPoint({ x, y });
    setIsSelecting(true);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove); // Add this line
  };
  const handleMouseMove = (event) => {
    if (isSelecting) {
      const rect = event.currentTarget.getBoundingClientRect();
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
  const handleIriTextChange = (content, delta, source, editor) => {
    setIriText(editor.getHTML());
    console.log("Fired handleiritextchange"); // This will get the HTML content from the editor
  };
  const handleIriTextUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setIriText(e.target.result);
    };
    reader.readAsText(file);
  };
  const staticHTML = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    * {
      font-family: Helvetica;
    }
    p, ul {
      display: block;
      margin-block-start: 0em;
      margin-block-end: 0em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-family: Helvetica;
    }
  </style>
  </head>
  <body>
    <p><strong>Important Risk Information</strong></p><br>
    <p><strong>What is SLYND?</strong></p>
    <p>
      SLYND is a birth control pill (oral contraceptive) that is used by females
      who can become pregnant to prevent pregnancy.
    </p>
<br>
    <p>
      The progestin drospirenone may increase potassium levels in your blood.
      You should not take SLYND if you have kidney, liver or adrenal disease
      because this could cause serious heart problems as well as other health
      problems. Other medicines may also increase potassium levels in your
      blood. If you are currently on daily, long-term treatment for a chronic
      health condition with any of the medicines listed below, talk to your
      healthcare provider about whether SLYND is right for you. If you take any
      of the medicines listed below for a chronic health condition you should have a blood test to check the potassium level in your blood before you start taking SLYND and during the first month that you take SLYND.</p>
      <ul>
      <li>medicines to treat fungal infections, such as ketoconazole, itraconazole, or voriconazole</li>
      <li>medicines to treat Human Immunodeficiency Virus (HIV) infection or Hepatitis C infection, such as indinavir or boceprevir</li>
      <li>clarithromycin</li>
      </ul>
      <br>
      <p><strong>Do not take SLYND if you:</strong></p>
      <ul>
      <li>have kidney disease or kidney failure.</li>
      <li>have reduced adrenal gland function.</li>
      <li>have or have had cervical cancer or any cancer that is sensitive to female hormones</li>
      <li>have liver disease, including liver tumors.</li>
        <li>have unexplained vaginal bleeding.
        </li>
        </ul>
      Tell your healthcare providers if you have or have had any of these conditions. Your healthcare provider can suggest a different method of birth control.
    <br><br><strong>If any of these conditions happen while you are taking SLYND, stop taking SLYND right away and talk to your healthcare provider. Use non-hormonal contraception when you stop taking SLYND.</strong>
<br><br>
    <strong>Before you take SLYND, tell your healthcare provider about all of your medical conditions, including if you:</strong>
  <ul>
    <li>are pregnant or think you may be pregnant.</li>
      <li>have ever had blood clots in your legs (deep vein thrombosis), lungs (pulmonary embolism), or a stroke or heart attack (myocardial infarction).</li>
      <li>have or have had depression.
      </li>
  </ul>  
  <br>
  <strong>Tell your healthcare providers about all the medicines you take </strong>including prescription and over-the-counter medicines, vitamins and herbal supplements, such as St. John's Wort. SLYND may affect the way other medicines work, and other medicines may affect how well SLYND works.
<bR><bR>
<strong>What are the possible serious side effects of SLYND?<br><br>
SLYND may cause serious side effects, including:<br>
<ul><li>High potassium levels in your blood (hyperkalemia).</strong> Certain medicines and conditions can also increase the potassium levels in your blood. Your healthcare provider may check the potassium levels in your blood before and during treatment with SLYND. <strong>Call your healthcare provider or go to a hospital emergency room right away if you have signs or symptoms of high potassium levels in your blood including:</strong></li>
<ul><li>weakness or numbness in an arm or leg.</li>
<li>palpitations (feel like your heart is racing or fluttering) or irregular heartbeat.</li>
<li>nausea.</li>
<li>vomiting.</li>
<li>severe pain in your chest.</li>
<li>shortness of breath.</li>
</ul>
<li> <strong>Blood clot forming in blood vessels.</strong><br> Tell your healthcare provider if you have had a blood clot. Tell your healthcare provider if you plan to have surgery or are not able to be active due to illness or injury. <strong>Call your healthcare provider or go to a hospital or emergency room right away if you have:</strong> 
<ul><li>leg pain that will not go away.</li>
<li>a sudden, severe headache unlike your usual headaches.</li>
<li>sudden, severe shortness of breath.</li>
<li>sudden change in vision or blindness.</li>
<li>chest pain.</li>
<li>weakness or numbness in your arm or leg.</li>
<li>trouble speaking.</li></ul>
<strong><li>Bone loss.</li>
<li>Cervical Cancer.</li>
<li>Liver problems, including liver tumors.</li>
<li>Ectopic pregnancy (pregnancy in your tubes).</strong> This is a medical emergency that often requires surgery. If you have severe abdominal pain, call your healthcare provider or go to a hospital emergency room right away.
Risk of high blood sugar levels in people with diabetes.</li>
<li><strong>Changes in menstrual bleeding. </strong>Tell your doctor if you have changes in menstrual bleeding.
<li><strong>Depression, especially if you have had depression in the past.</strong></li></ul>
<br>
<strong>What are the most common side effects of SLYND?</strong>
<ul><li>acne</li>
<li>headache</li>
<li>breast pain and tenderness</li>
<li>weight gain</li>
<li>menstrual cramps</li>
<li>nausea</li>
<li>severe vaginal bleeding</li>
<li>less sexual desire</li></ul>
<br>
These are not all the possible side effects of SLYND.<br><br>
<strong>Slynd does not protect against HIV infection (AIDS) and other sexually transmitted diseases (STDs).</strong><br><br>
This is not all of the important information about SLYND. <br><br>
<a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">Click here to access the full  <strong>Prescribing Information.</strong></a>
  </p>
  </body>
</html>
  `;
  const isiHTML = `
  <!DOCTYPE html>
<html>
<head>
<style>
  * {
    font-family: Helvetica;
  }
  p, ul {
    display: block;
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-family: Helvetica;
  }
</style>
</head>
<body>
  <p><strong>Important Safety Information</strong></p><br>
  <p><strong>Indication:</strong> SLYND (drospirenone) tablets are a progestin, indicated for females of reproductive potential to prevent pregnancy.</p>
  <br>
  <p><strong>Contraindications:</strong> SLYND is contraindicated in females with renal impairment, adrenal insuﬃciency, a presence or history of cervical cancer or progestin sensitive cancers, liver tumors (benign or malignant) or hepatic impairment, and undiagnosed abnormal uterine bleeding.</p>
  <br>
  <p><strong>Warnings and Precautions</strong></p>
  <ul>
    <li><strong>Hyperkalemia:</strong> SLYND has anti-mineralocorticoid activity, including the potential for hyperkalemia in high-risk females. Check serum potassium levels prior to starting treatment and during the ﬁrst treatment cycle in females receiving daily, long-term treatment for chronic conditions or diseases with medications that may increase serum potassium concentration. Consider monitoring serum potassium concentration in females at increased risk for hyperkalemia i.e., those females who take a strong CYP3A4 inhibitor long-term and concomitantly with SLYND. Monitor females taking SLYND who later develop conditions and/or begin medication that put them at an increased risk for hyperkalemia.</li>
    <li><strong>Thromboembolic Disorders:</strong> Epidemiological studies have not indicated an association between progestin-only preparations and an increased risk of myocardial infarction, cerebral thromboembolism, or venous thromboembolism. Consider the increased risk of thromboembolism inherent in the postpartum period and in females with a history of thromboembolism. Discontinue SLYND if a thromboembolic event occurs and consider discontinuing SLYND in case of prolonged immobilization due to surgery or illness.</li>
    <li><strong>Bone Loss:</strong> Treatment with SLYND leads to decreased estradiol serum levels. It is unknown if this may cause a clinically relevant loss of bone mineral density.</li>
    <li><strong>Liver Disease:</strong> Discontinue SLYND if jaundice or acute or chronic disturbances of liver function develop. Do not resume use until markers of liver function return to normal and SLYND causation has been excluded.</li>
    <li><strong>Ectopic Pregnancy:</strong> Be alert to the possibility of ectopic pregnancy in females who become pregnant or complain of lower abdominal pain while on SLYND.</li>
    <li><strong>Risk of Hyperglycemia in Patients with Diabetes:</strong> Females with diabetes may be at greater risk of hyperglycemia and may require additional medication adjustments or monitoring. Progestins, including SLYND, may decrease insulin sensitivity.</li>
    <li><strong>Bleeding Irregularities and Amenorrhea:</strong> Females may experience unscheduled (breakthrough or intracyclic) bleeding and spotting, especially during the ﬁrst three months of use. If bleeding persists, occurs after previously regular cycles, or if scheduled bleeding does not occur, evaluate for possible causes such as pregnancy or malignancy.</li>
    <li><strong>Depression:</strong> Carefully observe females with a history of depression and discontinue SLYND if depression recurs to a serious degree. Data on the association of progestin-only contraceptive products with onset of depression
    and exacerbation of depression are limited.</li>
  </ul>
  <br>
  <p>The most common adverse reactions (>1%) are: acne, metrorrhagia, headache, breast pain, weight increased, dysmenorrhea, nausea, vaginal hemorrhage, decreased libido, breast tenderness, irregular menstruation.</p>
  <br>
  <p><strong>Drug Interactions</strong></p>
  <p>Drugs or herbal products that induce certain enzymes (for example, CYP3A4) may decrease the eﬀectiveness of SLYND or increase breakthrough bleeding. Counsel patients to use a back-up or alternative non-hormonal method of contraception when enzyme inducers are used with SLYND and to continue back-up non-hormonal contraception for 28 days after discontinuing the enzyme inducer. Drugs or products that inhibit CYP3A4 may increase SLYND systemic exposure.</p>
  <br>
  <p>Please click here to access the full Prescribing Information.</p>
</body>
</html>
`;
  const handleExport = () => {
    const updatedText = isIri
      ? iriText.replace(
          "Click here to access the full <strong>Prescribing Information.</strong>",
          `<a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">Click here to access the full <strong>Prescribing Information.</strong></a>`
        )
      : isiHTML.replace(
          "Click here to access the full <strong>Prescribing Information.</strong>",
          `<a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">Click here to access the full <strong>Prescribing Information.</strong></a>`
        );
    console.log(updatedText); // Log updatedText in the console
    const zip = new JSZip();
    zip.file(
      "index.html",
      `<!DOCTYPE html>  
  <html>
  <head>
  <meta name="ad.size" content="width=${adSize.width},height=${adSize.height}">
  <script type="text/javascript">
    var clickTag = "${clickTag}";
  </script>
  <style>
    p {
      margin-block-start: 0em;
      margin-block-end: 0em;
    }
  </style>
  </head>
  <body style="margin: 0; padding: 0">
  <div style="position: absolute; width: ${adSize.width}px; height: ${
        adSize.height
      }px;">
    <div style="font-family: Helvetica, sans-serif; font-size: ${fontSize}; position: absolute; top: ${
        iriArea.y - 5
      }px; left: ${iriArea.x}px; z-index: 10001">
      <a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: blue; cursor: pointer;">${
        isIri
          ? "IRI Full Prescribing Information"
          : "ISI Full Prescribing Information"
      }</a>
    </div>
    <img src="bg.png" alt="Creative" style="position: absolute; width: 100%; height: 100%;">
    <div id="scrollingTextContainer" style="font-family: Helvetica, sans-serif; font-size: ${fontSize}; position: absolute; top: ${
        iriArea.y + 10
      }px; left: ${iriArea.x}px; height: ${iriArea.height}px; width: ${
        iriArea.width
      }px; overflow: hidden; z-index: 10000">
      <div id="scrollingText" style="position: absolute; white-space: pre-wrap;">${updatedText}</div>
    </div>
    <a href="javascript:void(window.open(clickTag))" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10;"></a>
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
    <>
      <AdContainer>
        <CreativeContainer
          style={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          {creative && (
            <>
              <img
                src={creative.src}
                alt="Creative"
                width={adSize.width}
                height={adSize.height}
                style={{
                  display: "block",
                  marginRight: "20px",
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
          {(isSelecting || (iriArea.width > 0 && iriArea.height > 0)) && (
            <FullPrescribingInfoLink top={iriArea.y - 5} left={iriArea.x} />
          )}
          <IriArea
            style={{
              position: "relative",
              top: iriArea.y - creative?.height + 20,
              left: iriArea.x,
              width: iriArea.width,
              height: iriArea.height,
              border: isSelecting ? "1px dashed #000" : "none",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
            dangerouslySetInnerHTML={{ __html: isIri ? iriText : isiHTML }}
          />
        </CreativeContainer>
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
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="start"
                control={
                  <Switch
                    checked={isIri}
                    onChange={(e) => {
                      setIsIri(e.target.checked);
                      setClickTag(
                        e.target.checked
                          ? "http://www.slynd.com"
                          : "https://hcp.slynd.com/"
                      );
                      setFullPrescribingInfoLink(
                        e.target.checked
                          ? "https://slynd.com/wp-content/uploads/2023/12/prescribing-information.pdf#page=15"
                          : "https://hcp.slynd.com/wp-content/uploads/2019/08/prescribing-information.pdf"
                      );
                    }}
                    color="primary"
                  />
                }
                label={isIri ? "IRI" : "ISI"}
                labelPlacement="start"
              />
            </FormGroup>
          </FormControl>
          <TextField
            label={isIri ? "IRI Click Tag URL" : "ISI Click Tag URL"}
            value={clickTag}
            onChange={(e) => setClickTag(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label={
              isIri
                ? "IRI Full Prescribing Information Link"
                : "ISI Full Prescribing Information Link"
            }
            value={fullPrescribingInfoLink}
            onChange={(e) => setFullPrescribingInfoLink(e.target.value)}
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
            {showOverlay
              ? "Hit Escape When Done"
              : `Select ${isIri ? "IRI" : "ISI"} Area`}
          </Button>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Customization Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontSize: "12px",
                  textAlign: "left",
                  paddingBottom: "5px",
                }}
              >
                {isIri ? "IRI Text" : "ISI Text"}
              </Typography>
              <ReactQuill
                ref={quillRef}
                value={isIri ? staticHTML : isiHTML}
                onChange={handleIriTextChange}
                theme="snow"
                modules={Ad.modules}
                formats={Ad.formats}
                style={{ height: "250px", marginBottom: "30px" }}
              />
              <TextField
                select
                label="Font Size"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                helperText="Select the font size"
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="6px">6px</MenuItem>
                <MenuItem value="7px">7px</MenuItem>
                <MenuItem value="8px">8px</MenuItem>
                <MenuItem value="10px">10px</MenuItem>
                <MenuItem value="12px">12px</MenuItem>
                <MenuItem value="14px">14px</MenuItem>
                <MenuItem value="18px">18px</MenuItem>
                <MenuItem value="24px">24px</MenuItem>
              </TextField>
              <TextField
                select
                label="Text Alignment"
                value={textAlign}
                onChange={(e) => setTextAlign(e.target.value)}
                helperText="Select the text alignment"
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
                <MenuItem value="justify">Justify</MenuItem>
              </TextField>
            </AccordionDetails>
          </Accordion>
          <Button variant="contained" onClick={handleExport} sx={{ margin: 1 }}>
            Export
          </Button>
          <Box sx={{ marginTop: 2, padding: 1, border: "1px solid grey" }}>
            <Typography variant="h6">
              {isIri ? "IRI" : "ISI"} Area Details:
            </Typography>
            <Typography variant="body1">X: {iriArea.x}px</Typography>
            <Typography variant="body1">Y: {iriArea.y}px</Typography>
            <Typography variant="body1">Width: {iriArea.width}px</Typography>
            <Typography variant="body1">Height: {iriArea.height}px</Typography>
          </Box>
          <br />
        </Sidebar>
      </AdContainer>
    </>
  );
}
export default Ad;
