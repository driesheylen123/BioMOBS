<script>
    import { Card } from 'sveltestrap';
    import { Table, Col, Container } from 'sveltestrap';

    export let datapoints = {};

    export let order_function;
    export let color_function;

    $: ordered_datapoints = Object.values(datapoints).sort((a,b) => { return order_function(b) - order_function(a) })
    $: top_datapoints = ordered_datapoints.slice(0,10)
    $: bottom_datapoints = ordered_datapoints.slice(-10)

    // $: console.log(ordered_datapoints)
</script>

<style>
</style>


<Card body>
    <h3>20 most discriminating features (green = low abundancies, red high) </h3>
    <Container>
        <Col class="col-4">
        <table>
            {#each top_datapoints as datapoint}
            <tr>
                <td><div style={"width:40px;height:20px;background-color:" + color_function(datapoint) }></div></td>
                <td>{datapoint._key}</td>
            </tr>
            {/each}
            <tr><td></td><td>...</td></tr>
            {#each bottom_datapoints as datapoint}
            <tr>
                <td><div style={"width:40px;height:20px;background-color:" + color_function(datapoint) }></div></td>
                <td>{datapoint._key}</td>
            </tr>
            {/each}
        </table>

    </Col>
    </Container>
</Card>
