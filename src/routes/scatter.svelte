<script context="module">
    export async function load({fetch}) {
        const res1 = await fetch('/api/OBSOLETE_datapoints.json')
        if ( res1.ok ) {
            return {
                props: {
                    datapoints: await res1.json()
                }
            }
        }
    }
</script>
<script>
    import { Input } from 'sveltestrap';
    import Scatterplot from '../components/Scatterplot.svelte';
    export let datapoints;
    let features = Object.keys(Object.values(datapoints)[0])
    let selectedFeatureX = features[0]
    let selectedFeatureY = features[1]

    $console.log(datapoints);

</script>


X axis:
<Input type="select" name="selectFeatureX" id="selectFeatureX" bind:value={selectedFeatureX}>
    {#each features as feature}
    <option>{feature}</option>
    {/each}
</Input><br/>

Y axis:
<Input type="select" name="selectFeatureY" id="selectFeatureY" bind:value={selectedFeatureY}>
    {#each features as feature}
    <option>{feature}</option>
    {/each}
</Input>

<Scatterplot datapoints={datapoints}
    x={selectedFeatureX}
    y={selectedFeatureY}
/>