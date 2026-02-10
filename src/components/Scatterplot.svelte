<script>
    import { scaleLinear } from 'd3-scale';
    import * as d3 from 'd3';
    import { Card } from 'sveltestrap';

    export let datapoints = {};
    export let x,y;
    $: x_extent = d3.extent(Object.values(datapoints).map((d) => { return d[x]}))
    $: y_extent = d3.extent(Object.values(datapoints).map((d) => { return d[y]}))
    $: xScale = scaleLinear().domain(x_extent).range([10,390])
    $: yScale = scaleLinear().domain(y_extent).range([390,10])
</script>

<style>
    circle {
        fill: greenyellow;
        fill-opacity: 0.4;
    }
    circle.navi {
        fill: rgb(154, 205, 50);
    }
    #ontop {
        z-index: 10;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>

<Card body>
<div id="ontop">
    <svg width="600" height="600">
        <circle class="navi" cx=300 cy=300 r=200 />
    </svg>
</div>
<svg width="600" height="600">
    {#each Object.values(datapoints) as datapoint}
        <circle cx={xScale(datapoint[x])} cy={yScale(datapoint[y])} r=5 />
    {/each}
</svg>
</Card>