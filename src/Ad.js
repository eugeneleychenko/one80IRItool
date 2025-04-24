import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Switch,
  TextField,
  Typography,
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
  justifyContent: "space-between",
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
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [adSize, setAdSize] = useState({ width: 300, height: 250 });
  const [showOverlay, setShowOverlay] = useState(false);
  const [fontSize, setFontSize] = useState("10px");
  const [textAlign, setTextAlign] = useState("left");
  const [isIri, setIsIri] = useState(true);
  const [isAppNexus, setIsAppNexus] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("slynd");

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
        fontSize: fontSize,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      Full Prescribing Information
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

  Ad.formats = ["size", "bold", "list", "bullet", "indent", "link"];
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
    clipboard: {
      matchVisual: false,
    },
  };

  const quillRef = React.useRef(null);

  useEffect(() => {
    console.log(iriText);
  }, [iriText]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSelecting(false);
        setShowOverlay(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const Overlay = styled(Box)(({ show }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0)",
    cursor: show ? "crosshair" : "default",
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
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setStartPoint({ x, y });
    setIsSelecting(true);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
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
    window.removeEventListener("mousemove", handleMouseMove);
  };

  const handleIriTextChange = (content, delta, source, editor) => {
    setIriText(editor.getHTML());
    console.log("Fired handleiritextchange");
  };

  const handleIriTextUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setIriText(e.target.result);
    };
    reader.readAsText(file);
  };

  const staticHTML = selectedBrand === "slynd" ? `
<div style="white-space: normal;">
<p><strong>Slynd does not protect against HIV infection (AIDS) and other sexually transmitted diseases (STDs).</strong></p>    

    <br>
    <p>
        <strong>What is SLYND?</strong>
    </p>
    <p>SLYND is a birth control pill (oral contraceptive) that is used by females who can become pregnant to prevent
        pregnancy.</p>
    <br>
    <p><strong>Important Risk Information</strong></p>
    <p>The progestin drospirenone may increase potassium levels in your blood. You should not take SLYND if you have
        kidney, liver or adrenal disease because this could cause serious heart problems as well as other health
        problems. Other medicines may also increase
        potassium levels in your blood. If you are currently on daily, long-term treatment for a chronic health
        condition with any of the medicines listed below, talk to your healthcare provider about whether SLYND is right
        for you. If you take any of the
        medicines listed below for a chronic health condition you should have a blood test to check the potassium level
        in your blood before you start taking SLYND and during the first month that you take SLYND.</p>
    <ul>
        <li>medicines to treat fungal infections, such as ketoconazole, itraconazole, or voriconazole</li>
        <li>medicines to treat Human Immunodeficiency Virus (HIV) infection or Hepatitis C infection, such as indinavir
            or boceprevir
        </li>
        <li>clarithromycin</li>
    </ul>
    <br>
    <p>
        <strong>Do not take SLYND if you:</strong>
    </p>
    <ul>
        <li>have kidney disease or kidney failure.</li>
        <li>have reduced adrenal gland function.</li>
        <li>have or have had cervical cancer or any cancer that is sensitive to female hormones.</li>
        <li>have liver disease, including liver tumors.</li>
        <li>have unexplained vaginal bleeding.</li>
    </ul>
    <p>Tell your healthcare providers if you have or have had any of these conditions. Your healthcare provider can
        suggest a different method of birth control.</p>
    <br>
    <p>
        <strong>If any of these conditions happen while you are taking SLYND, stop taking SLYND right away and talk to
            your healthcare provider. Use non-hormonal contraception when you stop taking SLYND.</strong>
    </p>
    <br>
    <p>
        <strong>Before you take SLYND, tell your healthcare provider about all of your medical conditions, including if
            you:</strong>
    </p>
    <ul>
        <li>are pregnant or think you may be pregnant.</li>
        <li>have ever had blood clots in your legs (deep vein thrombosis), lungs (pulmonary embolism), or a stroke or
            heart attack (myocardial infarction).
        </li>
        <li>have or have had depression.</li>
    </ul>
    <br>
    <p>
        <strong>Tell your healthcare providers about all the medicines you take</strong>including prescription and
        over-the-counter medicines, vitamins and herbal supplements, such as St. John's Wort. SLYND may affect the way
        other medicines work, and other medicines
        may affect how well SLYND works.</p>
    <br>
    <p>
        <strong>What are the possible serious side effects of SLYND?</strong>
    </p>
    <br>
    <p>
        <strong>SLYND may cause serious side effects, including:</strong>
    </p>
    <ul>
        <li>
            <strong>High potassium levels in your blood (hyperkalemia).</strong>Certain medicines and conditions can
            also increase the potassium levels in your blood. Your healthcare provider may check the potassium levels in
            your blood before and during treatment
            with SLYND.
            <strong>Call your healthcare provider or go to a hospital emergency room right away if you have signs or
                symptoms of high potassium levels in your blood including:</strong>
            <ul>
                <li class="ql-indent-1">weakness or numbness in an arm or leg.</li>
                <li class="ql-indent-1">palpitations (feel like your heart is racing or fluttering) or irregular
                    heartbeat.
                </li>
                <li class="ql-indent-1">nausea.</li>
                <li class="ql-indent-1">vomiting.</li>
                <li class="ql-indent-1">severe pain in your chest.</li>
                <li class="ql-indent-1">shortness of breath.</li>
            </ul>
        </li>

        <li>
            <strong>Blood clot forming in blood vessels.</strong>Tell your healthcare provider if you have had a blood
            clot. Tell your healthcare provider if you plan to have surgery or are not able to be active due to illness
            or injury.
            <strong>Call your healthcare provider or go to a hospital or emergency room right away if you have:</strong>
        </li>
        <li class="ql-indent-1">leg pain that will not go away.</li>
        <li class="ql-indent-1">a sudden, severe headache unlike your usual headaches.</li>
        <li class="ql-indent-1">sudden, severe shortness of breath.</li>
        <li class="ql-indent-1">sudden change in vision or blindness.</li>
        <li class="ql-indent-1">chest pain.</li>
        <li class="ql-indent-1">weakness or numbness in your arm or leg.</li>
        <li class="ql-indent-1">trouble speaking.</li>
        <li>
            <strong>Bone loss.</strong>
        </li>
        <li>
            <strong>Cervical Cancer.</strong>
        </li>
        <li>
            <strong>Liver problems, including liver tumors.</strong>
        </li>
        <li>
            <strong>Ectopic pregnancy (pregnancy in your tubes).</strong>This is a medical emergency that often requires
            surgery. If you have severe abdominal pain, call your healthcare provider or go to a hospital emergency room
            right away.
        </li>
        <li>
            <strong>Risk of high blood sugar levels in people with diabetes.</strong>
        </li>
        <li>
            <strong>Changes in menstrual bleeding.</strong>Tell your doctor if you have changes in menstrual bleeding.
        </li>
        <li>
            <strong>Depression, especially if you have had depression in the past.</strong>
        </li>
    </ul>
    <br>
    <p>
        <strong>What are the most common side effects of SLYND?</strong>
    </p>
    <ul>
        <li>acne</li>
        <li>headache</li>
        <li>breast pain and tenderness</li>
        <li>weight gain</li>
        <li>menstrual cramps</li>
        <li>nausea</li>
        <li>severe vaginal bleeding</li>
        <li>less sexual desire</li>
    </ul>
    <br>
    <p>These are not all the possible side effects of SLYND.</p>
    <br>
   
    <p>This is not all of the important information about SLYND.</p>
    <br>
    <p>Click on the ad to access the full <a href="${fullPrescribingInfoLink}" rel="noopener noreferrer" target="_blank">Prescribing Information</a>, including the Patient Information.</p>
</div>
` : `<div style="white-space: normal;">
<h1>IMPORTANT SAFETY INFORMATION</h1>
<h1>WARNING: CIGARETTE SMOKING AND SERIOUS CARDIOVASCULAR EVENTS and CONTRAINDICATED IN WOMEN WITH A BMI ≥30 KG/M<sup>2</sup></h1>

<h2><u>Cigarette Smoking and Serious Cardiovascular Events</u></h2>
<p>Cigarette smoking increases the risk of serious cardiovascular events from combined hormonal contraceptive (CHC) use. This risk increases with age, particularly in women over 35 years of age, and with the number of cigarettes smoked. For this reason, CHCs, including TWIRLA, are contraindicated in women who are over 35 years of age and smoke.</p>

<h2><u>Contraindicated in Women with a BMI ≥30 kg/m<sup>2</sup></u></h2>
<p>TWIRLA is contraindicated in women with a BMI ≥30 kg/m<sup>2</sup>. Compared to women with a lower BMI, women with a BMI ≥30 kg/m<sup>2</sup> had reduced effectiveness and may have a higher risk for venous thromboembolic events (VTEs).</p>

<h2>CONTRAINDICATIONS</h2>
<p>TWIRLA is contraindicated and should not be used in women who have or develop the following conditions:</p>
<ul>
    <li>At high risk of arterial or venous thromboembolic events, including smoke (if over age 35); have current or history of deep vein thrombosis or pulmonary embolism; have cerebrovascular disease; have coronary artery disease; have thrombogenic valvular or thrombogenic rhythm diseases of the heart; have inherited or acquired hypercoagulopathies; have uncontrolled hypertension with vascular disease; have diabetes mellitus and are over age 35, diabetes mellitus with hypertension or vascular disease or other end-organ damage, or diabetes mellitus of > 20 years duration</li>
    <li>Headaches with focal neurological symptoms, migraine with aura</li>
    <li>Women over 35 years of age with any migraine headache</li>
    <li>BMI ≥30 kg/m<sup>2</sup></li>
    <li>Liver tumors, acute viral hepatitis, or severe (decompensated) cirrhosis, or liver disease</li>
    <li>Undiagnosed abnormal uterine bleeding</li>
    <li>Pregnancy</li>
    <li>Current or history of breast cancer</li>
    <li>Hypersensitivity to any components of TWIRLA</li>
    <li>Use of Hepatitis C drug combinations containing ombitasvir/paritaprevir/ritonavir, with or without dasabuvir.</li>
</ul>

<h2>WARNINGS AND PRECAUTIONS</h2>
<p><strong>Thromboembolic Disorders and Other Vascular Conditions:</strong> Women are at increased risk for a venous thromboembolic event (VTE) when using TWIRLA.</p>
<ul>
    <li>Stop TWIRLA if an arterial or VTE occurs.</li>
    <li>Stop TWIRLA if there is unexplained loss of vision, proptosis, diplopia, papilledema, or retinal vascular lesions. Evaluate for retinal vein thrombosis immediately.</li>
    <li>Discontinue TWIRLA during prolonged immobilization and, if feasible, stop TWIRLA at least 4 weeks before and through 2 weeks after major surgery.</li>
    <li>Start TWIRLA no earlier than 4 weeks after delivery in women who are not breast-feeding.</li>
    <li>Before starting TWIRLA, evaluate any past medical history or family history of thromboembolism or thromboembolic disorders and consider whether history suggests inherited or acquired hypercoagulopathy.</li>
</ul>

<p><strong>Arterial Events:</strong> CHCs increase the risk of cardiovascular events and cerebrovascular events, such as myocardial infarction and stroke, particularly among older women (>35 years of age), smokers, and women with hypertension, dyslipidemia, diabetes, or obesity.</p>
<p><strong>Venous Events:</strong> The use of CHCs increase the risk of VTEs. Risk factors include, smoking, obesity, and family history of VTE, in addition to other factors that contraindicate use of CHCs.</p>

<p><strong>Liver Disease:</strong></p>
<ul>
    <li><strong>Elevated Liver Enzymes:</strong> Discontinue TWIRLA if jaundice develops. Acute liver test abnormalities may necessitate the discontinuation of CHC use until the liver tests return to normal and CHC causation has been excluded.</li>
    <li><strong>Liver Tumors:</strong> CHCs increase the risk of hepatic adenomas. Rupture of hepatic adenomas may cause death from abdominal hemorrhage. Studies have shown an increased risk of developing hepatocellular carcinoma in long-term (> 8 years) CHC users.</li>
</ul>

<p><strong>Risk of Liver Enzyme Elevations with Concomitant Hepatitis C Treatment:</strong> Discontinue TWIRLA prior to starting therapy with the hepatitis C combination drug regimen ombitasvir/paritaprevir/ritonavir, with or without dasabuvir. TWIRLA can be restarted approximately 2 weeks following completion of treatment with that combination drug regimen.</p>

<p><strong>Hypertension:</strong> For all women, monitor blood pressure at routine visits and stop TWIRLA if blood pressure rises significantly. An increase in blood pressure has been reported in women using CHCs, and this increase is more likely in older women with extended duration of use.</p>

<p><strong>Gallbladder Disease:</strong> Studies suggest CHCs increase the risk of developing gallbladder disease and may also worsen existing gallbladder disease.</p>

<p><strong>Adverse Carbohydrate and Lipid Metabolic Effects:</strong></p>
<ul>
    <li><strong>Hyperglycemia:</strong> TWIRLA may decrease glucose tolerance. Carefully monitor prediabetic and diabetic women who are using TWIRLA.</li>
    <li><strong>Dyslipidemia:</strong> Consider alternative contraception for women with uncontrolled dyslipidemia. TWIRLA may cause adverse lipid changes. Women with hypertriglyceridemia, or a family history thereof, may have an increase in serum triglyceride concentrations when using TWIRLA, which may increase the risk of pancreatitis.</li>
</ul>

<p><strong>Headache:</strong> If a woman using TWIRLA develops new headaches that are recurrent, persistent, or severe, evaluate the cause and discontinue TWIRLA as indicated. Consider discontinuation of TWIRLA if there is any increased frequency or severity of migraines during CHC use (which may be prodromal of a cerebrovascular event).</p>

<p><strong>Bleeding Irregularities and Amenorrhea:</strong></p>
<ul>
    <li><strong>Unscheduled and Scheduled Bleeding and Spotting:</strong> Women using TWIRLA may experience unscheduled bleeding and spotting, especially during the first 3 months of use. If bleeding persists or occurs after previously regular cycles on TWIRLA, evaluate for causes such as pregnancy or malignancy.</li>
    <li><strong>Amenorrhea and Oligomenorrhea:</strong> Women using TWIRLA may experience absence of scheduled bleeding, even if they are not pregnant. If scheduled bleeding does not occur, consider the possibility of pregnancy.</li>
</ul>

<p><strong>Other Warnings and Precautions</strong> include age-related considerations, depression, breast cancer, cervical cancer, effect on binding globulins, hereditary angioedema, and chloasma.</p>

<h2>ADVERSE REACTIONS</h2>
<p>The following serious adverse reactions occurred in &lt;1% of women who received TWIRLA: cholelithiasis, cholecystitis, major depression, suicidal ideation, appendicitis, ectopic pregnancy, pneumonia, and gastroenteritis. A total of 4 VTEs in TWIRLA-treated patients were identified in the phase 3 clinical trial. The most common adverse reactions (≥2%) in clinical trials for TWIRLA are application site disorders, nausea, headache, dysmenorrhea, and increased weight.</p>

<p>Patients should be counseled that TWIRLA does not protect against HIV infection (AIDS) and other sexually transmitted infections (STIs).</p>

<h2>DRUG INTERACTIONS</h2>
<p>Drugs or herbal products that induce certain enzyme inducers, including CYP3A4, may decrease the effectiveness of TWIRLA or increase breakthrough bleeding. Counsel patients to use a back-up or alternative method of contraception when enzyme inducers are used with TWIRLA.</p>

<h2>USE IN SPECIFIC POPULATIONS</h2>
<ul>
    <li>CHCs can reduce milk production in breastfeeding women. Advise the nursing woman to use another method of contraception while breastfeeding.</li>
    <li>Twirla is not indicated in females before menarche or postmenopausal women.</li>
</ul>

<p>To report SUSPECTED ADVERSE REACTIONS, call Exeltis at 1-877-324-9349 or FDA at <a href="http://www.fda.gov/medwatch" target="_blank" rel="noopener noreferrer">www.fda.gov/medwatch</a> or 1-800-FDA-1088.</p>

<p>Please see [PLACEMENT] for full <a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">Prescribing Information</a>, including BOXED WARNING, for additional Important Safety Information.</p>

<h2>INDICATION</h2>
<p>TWIRLA is indicated as a method of contraception for use in women of reproductive potential with a BMI &lt;30 kg/m<sup>2</sup> for whom a combined hormonal contraceptive is appropriate.</p>

<h2>Limitations of Use:</h2>
<p>Consider the reduced effectiveness of TWIRLA in women with a BMI ≥25 to &lt;30 kg/m<sup>2</sup> before prescribing TWIRLA. TWIRLA is contraindicated in women with a BMI ≥30 kg/m<sup>2</sup>.</p>
</div>`;

  const isiHTML = selectedBrand === "slynd" ? `<div style="white-space: normal;">
<br>
<p><strong>Indication</strong>: SLYND (drospirenone) tablets are a progestin, indicated for females of reproductive potential to prevent pregnancy.</p>
<br>
<p><strong>Important Safety Information</strong></p>
<br>
<p><strong>Contraindications</strong>: SLYND is contraindicated in females with renal impairment, adrenal insuﬃciency, a presence or history of cervical cancer or progestin sensitive cancers, liver tumors (benign or malignant) or hepatic impairment, and undiagnosed abnormal uterine bleeding.</p>
<br><br>
<p><strong>Warnings and Precautions</strong></p>

<p><strong>Hyperkalemia</strong>: SLYND has anti-mineralocorticoid activity, including the potential for hyperkalemia in high-risk females. Check serum potassium levels prior to starting treatment and during the ﬁrst treatment cycle in females receiving daily, long-term treatment for chronic conditions or diseases with medications that may increase serum potassium concentration. Consider monitoring serum potassium concentration in females at increased risk for hyperkalemia i.e., those females who take a strong CYP3A4 inhibitor long-term and concomitantly with SLYND. Monitor females taking SLYND who later develop conditions and/or begin medication that put them at an increased risk for hyperkalemia.</p>
<br>
<p><strong>Thromboembolic Disorders</strong>: Epidemiological studies have not indicated an association between progestin-only preparations and an increased risk of myocardial infarction, cerebral thromboembolism, or venous thromboembolism. Consider the increased risk of thromboembolism inherent in the postpartum period and in females with a history of thromboembolism. Discontinue SLYND if a thromboembolic event occurs and consider discontinuing SLYND in case of prolonged immobilization due to surgery or illness.</p>
<br>
<p><strong>Bone Loss</strong>: Treatment with SLYND leads to decreased estradiol serum levels. It is unknown if this may cause a clinically relevant loss of bone mineral density.</p>
<br>
<p><strong>Liver Disease</strong>: Discontinue SLYND if jaundice or acute or chronic disturbances of liver function develop. Do not resume use until markers of liver function return to normal and SLYND causation has been excluded.</p>
<br>
<p><strong>Ectopic Pregnancy</strong>: Be alert to the possibility of ectopic pregnancy in females who become pregnant or complain of lower abdominal pain while on SLYND.</p>
<br>
<p><strong>Risk of Hyperglycemia in Patients with Diabetes:</strong> Females with diabetes may be at greater risk of hyperglycemia and may require additional medication adjustments or monitoring. Progestins, including SLYND, may decrease insulin sensitivity.</p>
<br>
<p><strong>Bleeding Irregularities and Amenorrhea:</strong> Females may experience unscheduled (breakthrough or intracyclic) bleeding and spotting, especially during the ﬁrst three months of use. If bleeding persists, occurs after previously regular cycles, or if scheduled bleeding does not occur, evaluate for possible causes such as pregnancy or malignancy.</p>
<br>
<p><strong>Depression:</strong> Carefully observe females with a history of depression and discontinue SLYND if depression recurs to a serious degree. Data on the association of progestin-only contraceptive products with onset of depression and exacerbation of depression are limited.</p>
<br>
<p>The most common adverse reactions (>1%) are: acne, metrorrhagia, headache, breast pain, weight increased, dysmenorrhea, nausea, vaginal hemorrhage, decreased libido, breast tenderness, irregular menstruation.</p>
<br>
<p><strong>Drug Interactions</strong></p>
<p>Drugs or herbal products that induce certain enzymes (for example, CYP3A4) may decrease the eﬀectiveness of SLYND or increase breakthrough bleeding. Counsel patients to use a back-up or alternative non-hormonal method of contraception when enzyme inducers are used with SLYND and to continue back-up non-hormonal contraception for 28 days after discontinuing the enzyme inducer. Drugs or products that inhibit CYP3A4 may increase SLYND systemic exposure.</p>
<br>
<p><a href="https://hcp.slynd.com/wp-content/uploads/2019/08/prescribing-information.pdf" target="_blank" rel="noopener noreferrer"><strong>Click here</strong> to access the full <strong>Prescribing Information.</strong></p></a>
</div>` : `<div style="white-space: normal;">
<h2>IMPORTANT SAFETY INFORMATION AND INDICATION</h2><br>
<h2>IMPORTANT SAFETY INFORMATION</h2>
<h2>WARNING: CIGARETTE SMOKING AND SERIOUS CARDIOVASCULAR EVENTS and CONTRAINDICATED IN WOMEN WITH A BMI ≥30 KG/M<sup>2</sup></h2>
<br>
<h2><u>Cigarette Smoking and Serious Cardiovascular Events</u></h2>
<p><strong>Cigarette smoking increases the risk of serious cardiovascular events from combined hormonal contraceptive (CHC) use. This risk increases with age, particularly in women over 35 years of age, and with the number of cigarettes smoked. For this reason, CHCs, including TWIRLA, are contraindicated in women who are over 35 years of age and smoke.</strong></p>
<br>
<h2><u>Contraindicated in Women with a BMI ≥30 kg/m<sup>2</sup></u></h2>
<p><strong>TWIRLA is contraindicated in women with a BMI ≥30 kg/m<sup>2</sup>. Compared to women with a lower BMI, women with a BMI ≥30 kg/m<sup>2</sup> had reduced effectiveness and may have a higher risk for venous thromboembolic events (VTEs).</strong></p>
<br>

<h2>CONTRAINDICATIONS</h2>
<p>TWIRLA is contraindicated and should not be used in women who have or develop the following conditions:</p>
<ul>
    <li>At high risk of arterial or venous thromboembolic events, including smoke (if over age 35); have current or history of deep vein thrombosis or pulmonary embolism; have cerebrovascular disease; have coronary artery disease; have thrombogenic valvular or thrombogenic rhythm diseases of the heart; have inherited or acquired hypercoagulopathies; have uncontrolled hypertension with vascular disease; have diabetes mellitus and are over age 35, diabetes mellitus with hypertension or vascular disease or other end-organ damage, or diabetes mellitus of > 20 years duration</li>
    <li>Headaches with focal neurological symptoms, migraine with aura</li>
    <li>Women over 35 years of age with any migraine headache</li>
    <li>BMI ≥30 kg/m<sup>2</sup></li>
    <li>Liver tumors, acute viral hepatitis, or severe (decompensated) cirrhosis, or liver disease</li>
    <li>Undiagnosed abnormal uterine bleeding</li>
    <li>Pregnancy</li>
    <li>Current or history of breast cancer</li>
    <li>Hypersensitivity to any components of TWIRLA</li>
    <li>Use of Hepatitis C drug combinations containing ombitasvir/paritaprevir/ritonavir, with or without dasabuvir.</li>
</ul>
<BR>
<h2>WARNINGS AND PRECAUTIONS</h2>
<p><strong>Thromboembolic Disorders and Other Vascular Conditions:</strong> Women are at increased risk for a venous thromboembolic event (VTE) when using TWIRLA.</p><BR>
<ul>
    <li>Stop TWIRLA if an arterial or VTE occurs.</li>
    <li>Stop TWIRLA if there is unexplained loss of vision, proptosis, diplopia, papilledema, or retinal vascular lesions. Evaluate for retinal vein thrombosis immediately.</li>
    <li>Discontinue TWIRLA during prolonged immobilization and, if feasible, stop TWIRLA at least 4 weeks before and through 2 weeks after major surgery.</li>
    <li>Start TWIRLA no earlier than 4 weeks after delivery in women who are not breast-feeding.</li>
    <li>Before starting TWIRLA, evaluate any past medical history or family history of thromboembolism or thromboembolic disorders and consider whether history suggests inherited or acquired hypercoagulopathy.</li>
</ul>
<br>
<p><u>Arterial Events:</u> CHCs increase the risk of cardiovascular events and cerebrovascular events, such as myocardial infarction and stroke, particularly among older women (>35 years of age), smokers, and women with hypertension, dyslipidemia, diabetes, or obesity.</p>
<p><u>Venous Events:</u> The use of CHCs increase the risk of VTEs. Risk factors include, smoking, obesity, and family history of VTE, in addition to other factors that contraindicate use of CHCs.</p>
<br>
<p><strong>Liver Disease:</strong></p>
<br>
<ul>
    <li><strong>Elevated Liver Enzymes:</strong> Discontinue TWIRLA if jaundice develops. Acute liver test abnormalities may necessitate the discontinuation of CHC use until the liver tests return to normal and CHC causation has been excluded.</li>
    <li><strong>Liver Tumors:</strong> CHCs increase the risk of hepatic adenomas. Rupture of hepatic adenomas may cause death from abdominal hemorrhage. Studies have shown an increased risk of developing hepatocellular carcinoma in long-term (> 8 years) CHC users.</li>
</ul>
<br>
<p><strong>Risk of Liver Enzyme Elevations with Concomitant Hepatitis C Treatment:</strong> Discontinue TWIRLA prior to starting therapy with the hepatitis C combination drug regimen ombitasvir/paritaprevir/ritonavir, with or without dasabuvir. TWIRLA can be restarted approximately 2 weeks following completion of treatment with that combination drug regimen.</p>
<br>
<p><strong>Hypertension:</strong> For all women, monitor blood pressure at routine visits and stop TWIRLA if blood pressure rises significantly. An increase in blood pressure has been reported in women using CHCs, and this increase is more likely in older women with extended duration of use.</p>
<br>
<p><strong>Gallbladder Disease:</strong> Studies suggest CHCs increase the risk of developing gallbladder disease and may also worsen existing gallbladder disease.</p>
<br>
<p><strong>Adverse Carbohydrate and Lipid Metabolic Effects:</strong></p>
<ul>
    <li><strong>Hyperglycemia:</strong> TWIRLA may decrease glucose tolerance. Carefully monitor prediabetic and diabetic women who are using TWIRLA.</li>
    <li><strong>Dyslipidemia:</strong> Consider alternative contraception for women with uncontrolled dyslipidemia. TWIRLA may cause adverse lipid changes. Women with hypertriglyceridemia, or a family history thereof, may have an increase in serum triglyceride concentrations when using TWIRLA, which may increase the risk of pancreatitis.</li>
</ul>

<p><strong>Headache:</strong> If a woman using TWIRLA develops new headaches that are recurrent, persistent, or severe, evaluate the cause and discontinue TWIRLA as indicated. Consider discontinuation of TWIRLA if there is any increased frequency or severity of migraines during CHC use (which may be prodromal of a cerebrovascular event).</p>
<br>
<p><strong>Bleeding Irregularities and Amenorrhea:</strong></p><br>
<ul>
    <li><strong>Unscheduled and Scheduled Bleeding and Spotting:</strong> Women using TWIRLA may experience unscheduled bleeding and spotting, especially during the first 3 months of use. If bleeding persists or occurs after previously regular cycles on TWIRLA, evaluate for causes such as pregnancy or malignancy.</li>
    <li><strong>Amenorrhea and Oligomenorrhea:</strong> Women using TWIRLA may experience absence of scheduled bleeding, even if they are not pregnant. If scheduled bleeding does not occur, consider the possibility of pregnancy.</li>
</ul>
<br>
<p><strong>Other Warnings and Precautions</strong> include age-related considerations, depression, breast cancer, cervical cancer, effect on binding globulins, hereditary angioedema, and chloasma.</p>
<br>
<h2>ADVERSE REACTIONS</h2><br>
<p>The following serious adverse reactions occurred in &lt;1% of women who received TWIRLA: cholelithiasis, cholecystitis, major depression, suicidal ideation, appendicitis, ectopic pregnancy, pneumonia, and gastroenteritis. A total of 4 VTEs in TWIRLA-treated patients were identified in the phase 3 clinical trial. The most common adverse reactions (≥2%) in clinical trials for TWIRLA are application site disorders, nausea, headache, dysmenorrhea, and increased weight.</p>

<p>Patients should be counseled that TWIRLA does not protect against HIV infection (AIDS) and other sexually transmitted infections (STIs).</p>
<br>
<h2>DRUG INTERACTIONS</h2>
<p>Drugs or herbal products that induce certain enzyme inducers, including CYP3A4, may decrease the effectiveness of TWIRLA or increase breakthrough bleeding. Counsel patients to use a back-up or alternative method of contraception when enzyme inducers are used with TWIRLA.</p>
<br>
<h2>USE IN SPECIFIC POPULATIONS</h2>
<ul>
    <li>CHCs can reduce milk production in breastfeeding women. Advise the nursing woman to use another method of contraception while breastfeeding.</li>
    <li>Twirla is not indicated in females before menarche or postmenopausal women.</li>
</ul>

<p>To report SUSPECTED ADVERSE REACTIONS, call Exeltis at 1-877-324-9349 or FDA at <a href="http://www.fda.gov/medwatch" target="_blank" rel="noopener noreferrer">www.fda.gov/medwatch</a> or 1-800-FDA-1088.</p><br>

<b><p>Click <a href="twirla.com/pi">here</a> or visit <a href="twirla.com/pi">twirla.com/pi</a> for full Prescribing Information, including BOXED WARNING, for additional Important Safety Information.</p><b>
<br>
<h2>INDICATION</h2>
<b><p>TWIRLA is indicated as a method of contraception for use in women of reproductive potential with a BMI &lt;30 kg/m<sup>2</sup> for whom a combined hormonal contraceptive is appropriate.</p></b>
<br>
<p><u>Limitations of Use:</u></p>
<p>Consider the reduced effectiveness of TWIRLA in women with a BMI ≥25 to &lt;30 kg/m<sup>2</sup> before prescribing TWIRLA. TWIRLA is contraindicated in women with a BMI ≥30 kg/m<sup>2</sup>.</p>
</div>`;

  const handleExport = () => {
    const updatedText = isIri
      ? iriText.replace(
          "Click on the ad to access the full Prescribing Information, including the Patient Information.",
          `Click on the ad to access the full <a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">Prescribing Information</a>, including the Patient Information.`
        )
      : isiHTML.replace(
          '<p><a href="https://slynd.com/wp-content/uploads/2024/04/prescribing-information.pdf" target="_blank" rel="noopener noreferrer"><strong>Full Prescribing Information</strong></a></p>',
          ""
        );

    const zip = new JSZip();

    // Different HTML templates based on isAppNexus
    const htmlContent = `<!DOCTYPE html>  
<html>
<head>
<meta name="ad.size" content="width=${adSize.width},height=${adSize.height}">
${
  isAppNexus
    ? '<script type="text/javascript" src="https://acdn.adnxs.com/html5-lib/1.3.0/appnexus-html5-lib.min.js"></script>'
    : ""
}
<script type="text/javascript">
  var clickTag = "${clickTag}";
</script>
<style>
  p, ul {
    margin: 0;
  }
  .ql-indent-1 {
    margin-left: 4.5em;
  }
</style>
</head>
<body style="margin: 0; padding: 0">
<div style="position: absolute; width: ${adSize.width}px; height: ${
      adSize.height
    }px;">
  <div style="font-family: Helvetica, sans-serif; font-size: ${fontSize}; position: absolute; top: ${
      iriArea.y - 15
    }px; left: ${iriArea.x}px; z-index: 10001">
    <a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: blue; cursor: pointer;"><strong>Full Prescribing Information</strong></a>
  </div>
  <img src="bg.png" alt="Creative" style="position: absolute; width: 100%; height: 100%;">
  <div id="scrollingTextContainer" style="font-family: Helvetica, sans-serif; font-size: ${fontSize}; position: absolute; top: ${
      iriArea.y
    }px; left: ${iriArea.x}px; height: ${iriArea.height}px; width: ${
      iriArea.width
    }px; overflow: hidden; z-index: 10000">
    <div id="scrollingText" style="position: absolute; white-space: pre-wrap;">${updatedText}</div>
  </div>
  ${
    isAppNexus
      ? '<a href="javascript:void(0)" onClick="window.open(APPNEXUS.getClickTag(), \'_blank\');" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10;"></a>'
      : '<a href="javascript:void(window.open(clickTag))" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10;"></a>'
  }
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
</html>`;

    zip.file("index.html", htmlContent);
    zip.file("bg.png", creative.src.split(",")[1], { base64: true });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "ad.zip");
    });
  };

  useEffect(() => {
    // Update URLs and links when brand changes
    if (selectedBrand === "slynd") {
      setClickTag(isIri ? "http://www.slynd.com" : "https://hcp.slynd.com/");
      setFullPrescribingInfoLink(
        isIri
          ? "https://slynd.com/wp-content/uploads/2023/12/prescribing-information.pdf#page=15"
          : "https://slynd.com/wp-content/uploads/2024/04/prescribing-information.pdf"
      );
    } else { // twirla
      setClickTag(isIri ? "https://www.twirla.com" : "https://www.twirla.com/hcp/");
      setFullPrescribingInfoLink("https://twirla.com/pi");
    }
  }, [selectedBrand, isIri]);

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
            <FullPrescribingInfoLink top={iriArea.y - 15} left={iriArea.x} />
          )}
          <IriArea
            style={{
              position: "absolute",
              top: iriArea.y,
              left: iriArea.x,
              width: iriArea.width,
              height: iriArea.height,
              border: isSelecting ? "1px dashed #000" : "none",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            <div
              className="ql-editor"
              style={{ padding: "5px", paddingTop: "20px" }} // Added padding-top to make room for the fixed link
              dangerouslySetInnerHTML={{ __html: isIri ? iriText : isiHTML }}
            />
          </IriArea>
        </CreativeContainer>
        <Sidebar>
          <TextField
            select
            label="Brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            helperText="Please select the brand"
            variant="outlined"
            fullWidth
            margin="normal"
          >
            <MenuItem value="slynd">Slynd</MenuItem>
            <MenuItem value="twirla">Twirla</MenuItem>
          </TextField>
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
                      if (selectedBrand === "slynd") {
                        setClickTag(
                          e.target.checked
                            ? "http://www.slynd.com"
                            : "https://hcp.slynd.com/"
                        );
                        setFullPrescribingInfoLink(
                          e.target.checked
                            ? "https://slynd.com/wp-content/uploads/2023/12/prescribing-information.pdf#page=15"
                            : "https://slynd.com/wp-content/uploads/2024/04/prescribing-information.pdf"
                        );
                      } else { // twirla
                        setClickTag(
                          e.target.checked
                            ? "https://www.twirla.com"
                            : "https://www.twirla.com/hcp/"
                        );
                        setFullPrescribingInfoLink("https://twirla.com/pi");
                      }
                    }}
                    color="primary"
                  />
                }
                label={isIri ? "IRI" : "ISI"}
                labelPlacement="start"
              />
              <FormControlLabel
                value="appnexus"
                control={
                  <Switch
                    checked={isAppNexus}
                    onChange={(e) => setIsAppNexus(e.target.checked)}
                    color="primary"
                  />
                }
                label="AppNexus"
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
