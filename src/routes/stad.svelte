<script context="module">
    export async function load({fetch}) {
        const res1 = await fetch('/static/datapoints.json')
        const res2 = await fetch('/static/edges.json')
        const res3 = await fetch('/static/feature_datapoints.json')
        if ( res1.ok && res2.ok && res3.ok ) {
            return {
                props: {
                    datapoints: await res1.json(),
                    edges: await res2.json(),
                    feature_datapoints: await res3.json()
                }
            }
        }
    }
</script>

<script>
    export let datapoints
    export let edges
    export let feature_datapoints

    import { selected_datapoints, selected_feature_datapoints } from './store'
    import { extent } from 'd3';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { schemeCategory10 } from 'd3-scale-chromatic'
    import NodeLink3DCanvas from '../components/NodeLink3DCanvas.svelte';
    import NodeLinkCanvas from '../components/NodeLinkCanvas.svelte';
    import FeatureList from '../components/FeatureList.svelte'
    import { Input, Col, Container, Row } from 'sveltestrap';

    let feature_list = ["","age","gender","X__Saturatie","Albumine","Albumine____","Aldosteron","Alfa_1_globulinen","Alfa_2_globulinen","Alkalische_fosfatasen","Antithrombine","Apolipoproteine_A1","Apolipoproteine_B","Basofielen","Beta_globulinen","Bicarbonaat","Bilirubine_totaal","C_peptide_nuchter","Calcium","Calcium__urine_","Calcium_creatinine_ratio","Chloride_creatinine_ratio","Chloriden","Chloriden__urine_","Cholesterol","CK","Complement_C3","Complement_C3d","Complement_C4","Complement_CH50","Cortisol","Creatinine","Creatinine__mg_dL_","CRP_US","Eosinofielen","Eosinofielen_totaal","Ferritine","Foliumzuur_in_serum","Fosfaat","Fosfaat__urine_","Fosfaat_creat__ratio","Gamma_GT","Gamma_globulinen","Gastrine","Glucose","Haptoglobine","HbA1c__IFCC_","HbA1c_bij_niet_diabeticus","HDL_cholesterol","Hematocriet","IgA","IgE_totaal","IgG","IgG_subklasse_2","IgG_subklasse_3","IgG_subklasse_4","IgM","IJzer","Insuline_nuchter","Kalium","Kalium__urine_","Kalium_creatinine_ratio","Koper","LDH","LDL_cholesterol","Leukocyten","Lipase","Lipoproteine__a_","Lymfocyten","Lymfocyten____","Magnesium","Magnesium__urine_","Magnesium_creat__ratio","Monocyten","Natrium","Natrium__urine_","Natrium_creatinine_ratio","Neutrofiele_segmenten","non_HDL_cholesterol","Osmolaliteit","Osmolaliteit__urine_","pH","Proteine_C_activiteit","Proteine_S_vrij","Renine","Soortelijk_gewicht","Totaal_eiwit","Transaminase_ALT__GPT_","Transaminase_AST__GOT_","Transcortine","Transferrine","Triglyceriden","Trombocyten","Ureum","Urinezuur","Urinezuur__mg_dL_","Urinezuur_creat__ratio","Vrij_plasmacortisol","Zink__serum_"]
    let individuals = ["","IAM01","IAM02","IAM03","IAM04","IAM05","IAM06","IAM07","IAM08","IAM09","IAM10","IAM11","IAM12","IAM13","IAM14","IAM15","IAM16","IAM17","IAM18","IAM19","IAM20","IAM21","IAM22","IAM23","IAM24","IAM25","IAM26","IAM27","IAM28","IAM29","IAM30"]

    let lowColor = "#edf8b1"
    let highColor = "#2c7fb8"

    // const classColorScale = (d) => {
    //     return scaleOrdinal(schemeCategory10).range()[d["class"]]
    // }

    let colorScales = {}
    $: {
        feature_list.forEach((f) => {
            let values = Object.values(datapoints).map((d) => { return d[f] })
            let colorScale = (d) => {
                return scaleLinear().domain(extent(values)).range([lowColor,highColor])(d[f])
            }
            colorScales[f] = colorScale
        })
        colorScales['gender'] = (d) => {
            if (d["gender"] == "M" ) { return "blue" }
            else { return "pink" }
        }
    }

    // let colorScale;
    let selectedColorScale = "";
    let selectedIndividual;

    $: {
        if ( selectedIndividual ) {
            $selected_datapoints = {}
            if ( selectedIndividual != "" ) {
                // selectedColorScale = "eccentricity"
                let individual_objects = Object.values(datapoints)
                                            .filter((d) => { return d.individual == selectedIndividual })
                                            .map(d => { return d["_id"]})
                individual_objects.forEach((ind) => { $selected_datapoints[ind] = true })
            }
        }
    }

    $: colorScale = colorScales[selectedColorScale]

    let colorScaleFeature = scaleLinear().domain([-1,0,1]).range(["#fc8d59","#ffffbf","#91cf60"])

    $: value_difference = (n) => {
        let all_dp = Object.values(datapoints)
                            .sort((a,b) => { return a[n["_key"]] - b[n["_key"]] } )
                            .map(d => { return d[n["_key"]]})
        let selected_dp = Object.values(datapoints)
                                .filter((d) => { return $selected_datapoints[d.id] })
                                .sort((a,b) => { return a[n["_key"]] - b[n["_key"]] } )
                                .map(d => { return d[n["_key"]]})
        let median_selected = selected_dp[Math.floor(selected_dp.length/2)]
        let rest_dp = Object.values(datapoints)
                            .filter((d) => { return ! $selected_datapoints[d.id] })
                            .sort((a,b) => { return a[n["_key"]] - b[n["_key"]] } )
                            .map(d => { return d[n["_key"]]})
        let median_rest = rest_dp[Math.floor(rest_dp.length/2)]

        let q75 = all_dp[Math.floor(all_dp.length*0.75)]
        let q25 = all_dp[Math.floor(all_dp.length*0.25)]
        let iqr = q75-q25

        let difference = (median_selected - median_rest)/iqr
        return difference
    }

</script>

<h1>STAD</h1>
Colour scheme datapoints:
<Input type="select" name="select" id="colourSchemeSelect" bind:value={selectedColorScale}>
    {#each feature_list as f}
        <option>{f}</option>
    {/each}
</Input>
Select individual:
<Input type="select" name="select" id="individualSelect" bind:value={selectedIndividual}>
    {#each individuals as ind}
        <option>{ind}</option>
    {/each}
</Input>

<Container fluid>
    <Row>
        <Col><NodeLink3DCanvas bind:datapoints={datapoints} edges={edges}
            bind:selected={$selected_datapoints}
            nodecolor_function={(node) => { if ( $selected_datapoints[node.id] ) { return "red" } else { return colorScale(node) }}}/>
        </Col>
        <Col><NodeLinkCanvas bind:datapoints={datapoints} edges={edges}
            bind:selected={$selected_datapoints}
            nodecolor_function={(node) => { if ( $selected_datapoints[node.id] ) { return "red" } else { return colorScale(node) }}}/>
        </Col>
        <Col>
            {#if ( Object.keys($selected_datapoints).length > 0 )}
            <FeatureList bind:datapoints={feature_datapoints}
            order_function={(node) => { return value_difference(node) }}
            color_function={(node) => { return colorScaleFeature(value_difference(node))}} />
            {/if}
        </Col>
    </Row>
</Container>