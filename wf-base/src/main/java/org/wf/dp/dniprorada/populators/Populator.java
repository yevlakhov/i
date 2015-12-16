package org.wf.dp.dniprorada.populators;

public interface Populator<Src, Dest> {

    void populate(Src src, Dest dest);
}
