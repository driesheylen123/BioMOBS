import db from '$lib/database';
import { aql } from "arangojs"
let data = {}

export async function get() {
    const query_datapoints = aql`FOR c IN bioMOBS_testdata_edges RETURN c`;
    const cursor_datapoints = await db.query(query_datapoints, { batchSize: 10 });
    for await (const batch of cursor_datapoints.batches) {
        // Process all values in a batch in parallel
        await Promise.all(batch.map(
            value => {
                value["id"] = value["_id"];
                value["source"] = value["_from"];
                value["target"] = value["_to"];
                data[value._key] = value
            }
        ));
    }
    return {
        status: 200,
        body: data
    }
}