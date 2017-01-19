package org.igov.model.subject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import org.igov.model.core.NamedEntity;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author HS
 */
@javax.persistence.Entity
public class SubjectHumanRole extends NamedEntity {

    @ManyToMany(fetch = FetchType.EAGER, targetEntity = SubjectHuman.class)
    @JoinTable(name = "SubjectHumanRole_SubjectHuman",
            joinColumns = @JoinColumn(name = "nID_SubjectHumanRole"),
            inverseJoinColumns = @JoinColumn(name = "nID_SubjectHuman"))
    @JsonManagedReference
    private List<SubjectHuman> aSubjectHuman = new ArrayList<>();

    public List<SubjectHuman> getaSubjectHuman() {
        return aSubjectHuman;
    }

    public void setaSubjectHuman(List<SubjectHuman> aSubjectHuman) {
        this.aSubjectHuman = aSubjectHuman;
    }

}
