/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.igov.model.subject;

import org.igov.model.core.GenericEntityDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

/**
 *
 * @author HS
 */
@Repository
public class SubjectHumanRoleDaoImpl extends GenericEntityDao<Long, SubjectHumanRole> implements SubjectHumanRoleDao {

    private static final Logger LOG = LoggerFactory.getLogger(SubjectHumanRoleDaoImpl.class);
    
    public SubjectHumanRoleDaoImpl() {
        super(SubjectHumanRole.class);
    }
    
}
