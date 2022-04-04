<script>
    import ForceGraph from 'force-graph';
    // import BrushGraph from './BrushGraph.svelte';
    import { onMount } from 'svelte';
    import { Card, Input } from 'sveltestrap';

	// See https://github.com/vasturiano/force-graph

    let divWidth;

    let my_id;
    export let datapoints = {}
    export let edges = {}
    export let selected = {}

    let graphDiv;
    let nodes = []
    let links = []

    let rel_size = 5
    let Graph;
    let brushing = false;
    let dragstart_x = null;
    let dragstart_y = null;

    let w;

    const handleKeydown = (e) => {
        if ( e.code == "ShiftLeft" || e.code == "ShiftRight" ) {
            brushing = true

            Graph.enableZoomInteraction(false)
            Graph.enablePanInteraction(false)
            Graph.resumeAnimation()
        }
    }
    const handleKeyup = () => {
        brushing = false
        Graph.enableZoomInteraction(true)
        Graph.enablePanInteraction(true)
        
        dragstart_x = null;
        dragstart_y = null;
    }

    const handleMousemove = (e) => {
        if ( brushing ) {
            let pos = Graph.screen2GraphCoords(e.offsetX, e.offsetY)
            if ( dragstart_x == null ) { dragstart_x = pos.x }
            if ( dragstart_y == null ) { dragstart_y = pos.y }

            let [min_x, max_x] = [dragstart_x, pos.x]//.sort()
            let [min_y, max_y] = [dragstart_y, pos.y]//.sort()
            Graph.graphData().nodes.filter((n) => {
                return n.x > min_x & n.x < max_x &
                       n.y > min_y & n.y < max_y
            }).forEach(n => {
                selected[n.id] = true
            })
        }
    }

    const default_nodesize_function = 10
    const default_nodecolor_function = ( node ) => {
        if ( selected[node.id] ) {return "rgba(255,0,0,0.8)"} else {return "rgba(70,130,180,0.5)"} }

    export let nodesize_function = default_nodesize_function
    export let nodecolor_function = default_nodecolor_function

    export let selectDatapoints = ( node ) => {
        selected = {}
        if ( node ) { selected[node.id] = true }
    }

    onMount(() => {
        my_id = "component_" + (Math.floor(Math.random()*1000000))

        nodes = JSON.parse(JSON.stringify(Object.values(datapoints)))
        links = JSON.parse(JSON.stringify(Object.values(edges)
            .map(l => { return {
                source: l.source,
                target: l.target,
                value: l.weight
        }})))

        Graph = ForceGraph()(graphDiv)
                    .graphData({ nodes, links })
                    .width(divWidth)
                    .height(500)
                    // .backgroundColor('#101020')
                    .backgroundColor("whitesmoke")
                    .nodeLabel('id')
                    .d3AlphaDecay(0)
                    .d3VelocityDecay(0.08)
                    .cooldownTime(60000)
                    .linkColor(() => 'rgba(0,0,0,0.05)')
                    // .linkColor(() => 'rgba(255,255,255,0.2)')
                    .onNodeHover(selectDatapoints)
                    .enablePointerInteraction(false)
    })

    $: { if ( Graph ) {
        Graph.nodeColor(nodecolor_function)
        Graph.nodeVal(nodesize_function)
        Graph.nodeRelSize(rel_size)
    }}
</script>

<style>
    .container {
        flex-direction: column;
    }
    #ontop {
        z-index: 10;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(255, 100, 100, 0.4);
    }
</style>

<svelte:window
    on:keydown={handleKeydown}
    on:keyup={handleKeyup}/>
<Card body>
    <div class="container">
    Node scale:<br/>
        <Input
          type="range"
          bind:value={rel_size}
          min=1
          max=20
          step=1
        />
    <div style="width:600px; height=600px">
        <!-- <div id="ontop"></div> -->
        <div class="plot" bind:this={graphDiv} on:mousemove={handleMousemove} bind:offsetWidth={divWidth} />
    </div>
</div>
</Card>