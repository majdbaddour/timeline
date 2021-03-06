# Timeline
    vw = timeline view port (used here also to refer to its width) 
    n = number of vw multipliers on either side of vw
    dw = moving div element inside vw (used here also to refer to its width) 
    dw = (2n+1) * vw

    here vw is in the middle of dw

    d0                    d1      d   d2                    d3
    ---------------------------------------------------------
    |                     |     vw     |                    |
    ---------------------------------------------------------
    t0            ot1     t1      t   t2   ot2              t3
                          et1         et2

    if we set d1 = 0 we get:
    d0 = -n * vw
    d1 = 0
    d2 = vw
    d3 = (n+1) * vw

    t0, t1, t2, t3: time points corresponding to d0, d1, d2, d3

    From the above:
    vw = (d2 - d1) in the space domain = (t2 - t1) in the time domain

    For a apoint in time t, corresponding to the point in space d, we have:
    (t - t1)/(t2 - t1) = (d - d1)/(d2 - d1)

    Substituting d1 = 0, t2 - t1 = scale, d2 - d1 = vw (viewport width):
    (t - t1)/scale = d/vw, or

        d = (t - t1) * vw / scale      <---- positioning formula on vw
    
    We can derive the deltas formula by putting d - d1 = dx, and t - t1 = dt
    
        dt = dx * scale / vw            <---- dragging formula

    The positioning formula above will be used to position points after adding (d1 - d0) = n * vw, since we're positioning points on the dw div, not vw:

        d = n * vw + (t - t1) * vw / scale       
        d = vw * (n + ((t - t1) / scale))    <---- positioning formula on dw

    vw / scale is the conversion factor between time and space: 
    cf = vw / scale

    When zooming in/out, the center of the scaling transform is the mouse position. 
    Therefore, if point d is the mouse posoition, corresponding to point t: neither point should change due to the transform:
    (old t2 - old t1) = (ot2 - ot1) = old scale = s1
    (new t2 - new t1) = (et2 - et1) = new scale = s2

    (t - t1)/(t2 - t1) = (t - et1)/(et2 - et1)
    (t - t1)/s1 = (t - et1)/s2
    (t - t1) * s2/s1 = (t - et1)

    et1 = t - (t - t1) * s2/s1     <----- formula for deriving new date anchor time value et1 from old anchor t1, and the old and new scale values, after zooming in/out
    
    From positioning formula on vw above
    t - t1 = d * scale / vw

    t = t1 + d * scale / vw   <----- time value from position in vw reference frame

    In the dw reference frame the mouse position d is expressed in reference to d0, therefore to trnasform it back to the vw frame we replace d => d - n * vw:
    t = t1 + (d - n * vw) * scale / vw 
   
    t = t1 + (d / vw - n) * scale  <----- time value from position in dw reference frame
