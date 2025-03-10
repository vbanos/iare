import React, { useState } from 'react';
import RefDetails from './RefDetails.js';
import { API_V2_URL_BASE } from '../../constants/endpoints.js';

function getLinkText(ref) {

    let text = "";

    if(ref.template_names)
    {
        ref.template_names.map((tn, i) => {
            // <span style={{fontWeight: "bold"}}>{tn}</span>
            text += tn + "\n";
            return null;
        })
    }

    if (ref.titles) {
        ref.titles.map((t,i) => {
            text += t + "\n";
            return null;
        })
    }

    if (!text) text += "ref id: " + ref.id;

    return <p>{text}</p>
}

function RefFlock({ refArray, refFilterDef } ) {

    const [refDetails, setRefDetails] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    const [referenceEndpoint, setReferenceEndpoint] = useState( "" );

    const fetchDetail = (ref) => {
        // handle null pageData
        if (!ref) {
            setRefDetails("Trying to fetch invalid reference");
            return;
        }

        // TODO: use refresh here ?
        const endpoint = `${API_V2_URL_BASE}/statistics/reference/${ref.id}`;
        setReferenceEndpoint(endpoint)

        // fetch the data
        fetch(endpoint, {
        })

            .then((res) => {
                if(!res.ok) throw new Error(res.status);
                return res.json();
            })

            .then((data) => {
                setRefDetails(data);
            })

            .catch((err) => {
                setRefDetails(`Error with details (${err})`);
            })

            .finally(() => {
                // console.log("fetch finally")
            });

    }

    let refs;

    if (!refArray) {
        refs = <h4>No references!</h4>

    } else {
        // filter the refs if filter defined
        const filteredRefs = refFilterDef
            ? refArray.filter((refFilterDef.filterFunction)())
            : refArray;

        const refList = filteredRefs.map((ref, i) => {
            return <button key={i}
                           className={"ref-button"}
                           onClick={(e) => {
                               fetchDetail(ref)
                           }}>{getLinkText(ref)}</button>
        });

        const label = refFilterDef
            ? `${filteredRefs.length} Filtered Refs : ${refFilterDef.caption}`
            : `${filteredRefs.length} Refs (no filter)`
        refs = <>
            <h4>{label}</h4>
            <div className={"ref-list"}>
                {refList}
            </div>
        </>
    }

    return <div className={"ref-flock"}>
        <div className={"ref-list-wrapper"}>
            {refs}
        </div>

        <div className={"ref-details"}>
            <h4>Reference Details</h4>
            {/*<p>source: <a href={referenceEndpoint} target={"_blank"} rel={"noreferrer"}>{referenceEndpoint}</a></p>*/}
            <RefDetails details={refDetails} source={referenceEndpoint}/>
        </div>
    </div>
}

export default RefFlock;