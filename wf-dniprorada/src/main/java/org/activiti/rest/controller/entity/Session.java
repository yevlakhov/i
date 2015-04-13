package org.activiti.rest.controller.entity;

/**
 * Created by diver on 4/13/15.
 */
public class Session implements SessionI {

    private String id;

    public Session() {}

    public Session(String id) {
        this.id = id;
    }

    @Override
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Session session = (Session) o;

        if (id != null ? !id.equals(session.id) : session.id != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Session{" +
                "id='" + id + '\'' +
                '}';
    }
}
