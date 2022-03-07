<script>
    import { onMount } from 'svelte';
    import * as d3 from "d3";

    export let datapoints = {};
    export let edges = {};

    $: nodes = Object.values(datapoints)
    $: links = JSON.parse(JSON.stringify(Object.values(edges)
            .map(l => { return {
                source: l._from,
                target: l._to,
                value: l.weight
        }})))
	let draggedNode = null;
    let simulation;
    $: console.log(links)
    
    $: console.log(nodes)

	function dragNode(event) {
		if ( draggedNode ) {
			datapoints[draggedNode].x = event.offsetX;
            datapoints[draggedNode].y = event.offsetY;
            datapoints[draggedNode].cx = datapoints[draggedNode].x
            datapoints[draggedNode].cy = datapoints[draggedNode].y
            ticked()
		}
    }
    
    onMount(runSimulation);

    function ticked() {
        for (let node of nodes) {
            node.cx = node.x
            node.cy = node.y
        }
        nodes = nodes
        links = links
        // simulation.tick()
    }

    function runSimulation() {
        simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-30))
            .force("center", d3.forceCenter(300,300))
            .on('tick', ticked)
    }

    // let previouslySelectedDatapointIDs = []
    // let selectedDatapointIDs = []

    // $: {
    //     let toRemove = previouslySelectedDatapointIDs.filter(x => !selectedDatapointIDs.includes(x))
    //     let toAdd = selectedDatapointIDs.filter(function(x) { return !previouslySelectedDatapointIDs.includes(x) })

    //     for ( let id of toRemove ) {
    //         datapoints[id].selected = false
    //     }
    //     for ( let id of toAdd ) {
    //         datapoints[id].selected = true
    //     }

    //     previouslySelectedDatapointIDs = selectedDatapointIDs;
    // }
</script>

<style>
	circle {
		fill: steelblue;
        visibility:visible; 
	}
    circle:hover {
        fill: red;
    }
    line {
        stroke: #999;
        stroke-opacity: 0.6;
    }
    .selected {
        fill: red;
        r: 7;
    }
</style>

<svg
    width="400"
    height="400"
    on:mousemove={dragNode}
    on:mouseup={() => { if ( draggedNode ) { runSimulation() }; draggedNode = null; }}>
    <!-- {#each links as link}
    <line x1='{link.source.x}' y1='{link.source.y}' 
            x2='{link.target.x}' y2='{link.target.y}' >
    </line>
    {/each} -->

	{#each nodes as point}
        <circle
            class:selected={point.selected}
            cx={point.x}
            cy={point.y}
            r="5"
            on:mousedown={() => { draggedNode = point.id ; runSimulation() } }
            />
    {/each}
</svg>
